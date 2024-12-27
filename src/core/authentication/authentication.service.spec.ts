import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { TeachersService } from '../../teachers/teachers.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { HttpException } from '@nestjs/common';
import { TeacherModel } from 'src/models/teachers/teachers.model';

describe('AuthenticationService', () => {
  let authService: AuthenticationService;
  let teachersService: Partial<TeachersService>;
  let jwtService: Partial<JwtService>;
  let configService: Partial<ConfigService>;

  beforeEach(async () => {
    teachersService = {
      findByUserName: jest.fn(),
      findWithDetails: jest.fn(),
      create: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('fakeToken'),
    };

    configService = {
      get: jest.fn((key: string) => {
        if (key === 'BCRYPT_SALT_ROUNDS') return '10';
        if (key === 'JWT_EXPIRATION_TIME') return '3600';
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        { provide: TeachersService, useValue: teachersService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    authService = module.get<AuthenticationService>(AuthenticationService);
  });

  describe('getAuthenticatedUser', () => {
    it('should return user if credentials are valid', async () => {
      const mockUser: TeacherModel = {
        id: 1,
        username: 'test',
        password: 'hashedPassword',
        role_id: null,
        name: 'Test User',
        role_name: 'Admin',
        created_at: "29/01/2000",
        deleted: false,
      };
      
      jest.spyOn(teachersService, 'findByUserName').mockResolvedValue(mockUser);
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(true);

      const result = await authService.getAuthenticatedUser('test', 'plainPassword');

      expect(result).toEqual(mockUser);
      expect(teachersService.findByUserName).toHaveBeenCalledWith('test');
      expect(bcrypt.compare).toHaveBeenCalledWith('plainPassword', 'hashedPassword');
    });

    it('should throw an exception if credentials are invalid', async () => {
      jest.spyOn(teachersService, 'findByUserName').mockResolvedValue(null);

      await expect(authService.getAuthenticatedUser('test', 'plainPassword'))
        .rejects.toThrow(HttpException);
    });
  });

  describe('register', () => {
    it('should create and return a new user', async () => {
      const mockUser: TeacherModel = {
        id: 1,
        username: 'test',
        password: 'hashedPassword',
        role_id: null,
        name: 'Test User',
        role_name: 'Admin',
        created_at: "29/01/2024",
        deleted: false,
      };
      
      jest.spyOn(teachersService, 'findByUserName').mockResolvedValue(null);
      jest.spyOn(teachersService, 'create').mockResolvedValue(mockUser);
      (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockResolvedValue("hashedPassword");

      const registrationData = { name: 'test', password: 'plainPassword',username:"tuan",role_id:1 };
      const result = await authService.register(registrationData);

      expect(result).toEqual(mockUser);
      expect(teachersService.findByUserName).toHaveBeenCalledWith('tuan');
      expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword', 10);
      expect(teachersService.create).toHaveBeenCalledWith({
        ...registrationData,
        password: 'hashedPassword',
      });
    });

    it('should throw an exception if user already exists', async () => {
      const mockUser: TeacherModel = {
        id: 1,
        username: 'test',
        password: 'hashedPassword',
        role_id: null,
        name: 'Test User',
        role_name: 'Admin',
        created_at: "29/01/2024",
        deleted: false,
      };
      jest.spyOn(teachersService, 'findByUserName').mockResolvedValue(mockUser);

      const registrationData = { name: 'test', password: 'plainPassword',username:"tuan",role_id:1 };

      await expect(authService.register(registrationData)).rejects.toThrow(HttpException);
    });
  });

  describe('getCookieWithJwtToken', () => {
    it('should return a valid JWT cookie', () => {
      const result = authService.getCookieWithJwtToken(1);

      expect(result).toContain('Authentication=fakeToken');
      expect(result).toContain('Max-Age=3600');
      expect(jwtService.sign).toHaveBeenCalledWith({ userId: 1 });
    });
  });

  describe('getCookieForLogOut', () => {
    it('should return a logout cookie', () => {
      const result = authService.getCookieForLogOut();

      expect(result).toBe('Authentication=; HttpOnly; Path=/; Max-Age=0');
    });
  });
});
