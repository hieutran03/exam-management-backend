import { Test, TestingModule } from '@nestjs/testing';
import { TeachersService } from './teachers.service';
import { TeachersRepository } from './teachers.repository';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import RegisterDto from 'src/models/authentication/dtos/register.dto';
import { UpdateTeacherDTO } from 'src/models/teachers/dtos/update-teacher.dto';

describe('TeachersService', () => {
  let service: TeachersService;
  let teacherRepository: Partial<TeachersRepository>;
  let configService: Partial<ConfigService>;

  beforeEach(async () => {
    teacherRepository = {
      getAll: jest.fn(),
      getById: jest.fn(),
      getByUsername: jest.fn(),
      getWithDetails: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    configService = {
      get: jest.fn().mockReturnValue('10'), // Mock bcrypt salt rounds
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeachersService,
        { provide: TeachersRepository, useValue: teacherRepository },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<TeachersService>(TeachersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find', () => {
    it('should call getAll from teacherRepository', async () => {
      await service.find();
      expect(teacherRepository.getAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should call getById from teacherRepository with the correct id', async () => {
      const id = 1;
      await service.findById(id);
      expect(teacherRepository.getById).toHaveBeenCalledWith(id);
    });
  });

  describe('findByUserName', () => {
    it('should call getByUsername from teacherRepository with the correct username', async () => {
      const username = 'testuser';
      await service.findByUserName(username);
      expect(teacherRepository.getByUsername).toHaveBeenCalledWith(username);
    });
  });

  describe('findWithDetails', () => {
    it('should call getWithDetails from teacherRepository with the correct id', async () => {
      const id = 1;
      await service.findWithDetails(id);
      expect(teacherRepository.getWithDetails).toHaveBeenCalledWith(id);
    });
  });

  describe('create', () => {
    it('should call create from teacherRepository with the correct data', async () => {
      const teacher: RegisterDto = {
        name:"test",
        username: 'testuser',
        password: 'password',
        role_id: 1,
      };
      await service.create(teacher);
      expect(teacherRepository.create).toHaveBeenCalledWith(teacher);
    });
  });

  describe('updatePassword', () => {
    it('should hash the password and call update from teacherRepository', async () => {
      const id = 1;
      const password = 'newpassword';
      const hashedPassword = 'hashedpassword';
       (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockResolvedValue(hashedPassword);

      await service.updatePassword(id, password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10); // Mocked salt rounds
      expect(teacherRepository.update).toHaveBeenCalledWith(id, { password: hashedPassword });
    });
  });

  describe('update', () => {
    it('should call update from teacherRepository with the correct id and data', async () => {
      const id = 1;
      const teacher: UpdateTeacherDTO = {
        name: 'test',
        role_id: 1,
      };
      await service.update(id, teacher);
      expect(teacherRepository.update).toHaveBeenCalledWith(id, teacher);
    });
  });

  describe('delete', () => {
    it('should call delete from teacherRepository with the correct id', async () => {
      const id = 1;
      await service.delete(id);
      expect(teacherRepository.delete).toHaveBeenCalledWith(id);
    });
  });
});
