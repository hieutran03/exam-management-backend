import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { TeachersService } from '../../../src/teachers/teachers.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let authenticationService: AuthenticationService;
  let teachersService: TeachersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        {
          provide: AuthenticationService,
          useValue: {
            getCookieWithJwtToken: jest.fn(),
            getAuthenticatedUser: jest.fn(),
          },
        },
        {
          provide: TeachersService,
          useValue: {
            findWithDetails: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
    authenticationService = module.get<AuthenticationService>(AuthenticationService);
    teachersService = module.get<TeachersService>(TeachersService);
  });

  describe('login', () => {
    it('should login successfully and set JWT cookie', async () => {
      const mockRequest = { user: { id: 1, username: 'testUser' } } as any;
      const mockResponse = { setHeader: jest.fn() } as unknown as Response;

      jest.spyOn(authenticationService, 'getCookieWithJwtToken').mockReturnValue('jwt-token');

      const result = await controller.login(mockRequest, mockResponse);

      expect(result).toEqual(mockRequest.user);
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Set-Cookie', 'jwt-token');
    });

 

  
  });



 

    it('should throw an error if TeachersService fails', async () => {
      const mockRequest = { user: { id: 1 } } as any;

      jest.spyOn(teachersService, 'findWithDetails').mockImplementation(() => { 
        throw Error('Unexpected error');
      });

      await expect(controller.getMyProfile(mockRequest)).rejects.toThrow('Unexpected error');
    });
  });

afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});