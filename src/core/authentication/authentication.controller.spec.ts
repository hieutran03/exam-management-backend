import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { TeachersService } from '../../../src/teachers/teachers.service';
import JwtAuthenticationGuard  from './jwtAuthentication.guard';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import { ChangePasswordDTO } from '../../../src/models/teachers/dtos/change-password.dto';
import { Response } from 'express';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let authenticationService: Partial<AuthenticationService>;
  let userService: Partial<TeachersService>;

  beforeEach(async () => {
    authenticationService = {
      getCookieWithJwtToken: jest.fn().mockReturnValue('auth_token_cookie'),
      getCookieForLogOut: jest.fn().mockReturnValue('logout_cookie'),
    };

    userService = {
      findWithDetails: jest.fn().mockResolvedValue({ id: 1, name: 'John Doe' }),
      updatePassword: jest.fn().mockResolvedValue({ success: true }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        { provide: AuthenticationService, useValue: authenticationService },
        { provide: TeachersService, useValue: userService },
      ],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMyProfile', () => {
    it('should return user details', async () => {
      const mockRequest = { user: { id: 1 } } as any;
      const result = await controller.getMyProfile(mockRequest);
      expect(userService.findWithDetails).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1, name: 'John Doe' });
    });
  });

  describe('login', () => {
    it('should set a cookie and return user', () => {
      const mockRequest = { user: { id: 1, name: 'John Doe' } } as any;
      const mockResponse = { setHeader: jest.fn() } as unknown as Response;

      const result = controller.login(mockRequest, mockResponse);
      expect(authenticationService.getCookieWithJwtToken).toHaveBeenCalledWith(1);
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Set-Cookie', 'auth_token_cookie');
      expect(result).toEqual({ id: 1, name: 'John Doe' });
    });
  });

  describe('changePassword', () => {
    it('should update the user password', async () => {
      const mockRequest = { user: { id: 1 } } as any;
      const mockBody: ChangePasswordDTO = { password: 'newPassword123' };

      const result = await controller.changePassword(mockRequest, mockBody);
      expect(userService.updatePassword).toHaveBeenCalledWith(1, 'newPassword123');
      expect(result).toEqual({ success: true });
    });
  });

  describe('logout', () => {
    it('should set a cookie to log out', () => {
      const mockResponse = { setHeader: jest.fn() } as unknown as Response;

      controller.logout(mockResponse);
      expect(authenticationService.getCookieForLogOut).toHaveBeenCalled();
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Set-Cookie', 'logout_cookie');
    });
  });
});
