import { Test, TestingModule } from '@nestjs/testing';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';
import { AuthenticationService } from '../../src/core/authentication/authentication.service';
import { ChangePasswordDTO } from '../../src/models/teachers/dtos/change-password.dto';
import { RegisterDto } from '../../src/models/authentication/dtos/register.dto';
import { UpdateTeacherDTO } from '../../src/models/teachers/dtos/update-teacher.dto';
import  PermissionGuard  from '../../src/core/roles/permission.guard';
import  PermissionEnum  from '../../src/core/roles/permission.enum';

describe('TeachersController', () => {
  let controller: TeachersController;
  let teacherService: Partial<TeachersService>;
  let authenticationService: Partial<AuthenticationService>;

  beforeEach(async () => {
    teacherService = {
      find: jest.fn().mockResolvedValue([{ id: 1, name: 'John Doe' }]),
      findById: jest.fn().mockResolvedValue({ id: 1, name: 'John Doe' }),
      findWithDetails: jest.fn().mockResolvedValue({ id: 1, name: 'John Doe', details: {} }),
      updatePassword: jest.fn().mockResolvedValue({ success: true }),
      update: jest.fn().mockResolvedValue({ success: true }),
      delete: jest.fn().mockResolvedValue({ success: true }),
    };

    authenticationService = {
      register: jest.fn().mockResolvedValue({ id: 1, name: 'New Teacher' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeachersController],
      providers: [
        { provide: TeachersService, useValue: teacherService },
        { provide: AuthenticationService, useValue: authenticationService },
      ],
    }).compile();

    controller = module.get<TeachersController>(TeachersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllTeacher', () => {
    it('should return a list of teachers', async () => {
      const result = await controller.getAllTeacher();
      expect(teacherService.find).toHaveBeenCalled();
      expect(result).toEqual([{ id: 1, name: 'John Doe' }]);
    });
  });

  describe('getTeacherById', () => {
    it('should return a teacher by ID', async () => {
      const result = await controller.getTeacherById(1);
      expect(teacherService.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1, name: 'John Doe' });
    });
  });

  describe('getTeacherWithDetails', () => {
    it('should return a teacher with details', async () => {
      const result = await controller.getTeacherWithDetails(1);
      expect(teacherService.findWithDetails).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1, name: 'John Doe', details: {} });
    });
  });

  describe('createTeacher', () => {
    it('should create a new teacher', async () => {
      const dto: RegisterDto = { name: 'New Teacher', username: 'test@example.com', password: 'password',role_id:1 };
      const result = await controller.createTeacher(dto);
      expect(authenticationService.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ id: 1, name: 'New Teacher' });
    });
  });

  describe('changePassword', () => {
    it('should update the teacher password', async () => {
      const dto: ChangePasswordDTO = { password: 'newPassword123' };
      const result = await controller.changePassword(1, dto);
      expect(teacherService.updatePassword).toHaveBeenCalledWith(1, 'newPassword123');
      expect(result).toEqual({ success: true });
    });
  });

  describe('updateTeacher', () => {
    it('should update a teacher', async () => {
      const dto: UpdateTeacherDTO = { name: 'Updated Teacher',role_id:1 };
      const result = await controller.updateTeacher(1, dto);
      expect(teacherService.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({ success: true });
    });
  });

  describe('deleteTeacher', () => {
    it('should delete a teacher', async () => {
      const result = await controller.deleteTeacher(1);
      expect(teacherService.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ success: true });
    });
  });
});
