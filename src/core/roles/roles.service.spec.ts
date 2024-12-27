import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import RolesRepository from './roles.repository';
import { CreateRoleDTO } from 'src/models/role/dtos/create-role.dto';
import { UpdateRoleDTO } from 'src/models/role/dtos/update-role.dto';
import { RoleModel } from 'src/models/role/role.model';

describe('RolesService', () => {
  let service: RolesService;
  let rolesRepository: jest.Mocked<Partial<RolesRepository>>;

  beforeEach(async () => {
    rolesRepository = {
      get: jest.fn(),
      getById: jest.fn(),
      getWithDetails: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        { provide: RolesRepository, useValue: rolesRepository },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should call get from rolesRepository', async () => {
      rolesRepository.get.mockResolvedValueOnce([]);
      const result = await service.get();
      expect(rolesRepository.get).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should throw an error if get fails', async () => {
      rolesRepository.get.mockRejectedValueOnce(new Error('Database error'));
      await expect(service.get()).rejects.toThrow('Database error');
    });
  });

  describe('getById', () => {
    it('should call getById from rolesRepository with the correct id', async () => {
      const id = 1;
    const mockRole = { id: 1, name: 'Admin' }; // Cập nhật giá trị mong đợi.
    rolesRepository.getById.mockResolvedValueOnce(mockRole);
    const result = await service.getById(id);
    expect(rolesRepository.getById).toHaveBeenCalledWith(id);
    expect(result).toEqual(mockRole);
    });

    it('should throw an error if getById fails', async () => {
      rolesRepository.getById.mockRejectedValueOnce(new Error('Database error'));
      await expect(service.getById(1)).rejects.toThrow('Database error');
    });
  });

 

    it('should throw an error if getWithDetails fails', async () => {
      rolesRepository.getWithDetails.mockRejectedValueOnce(new Error('Database error'));
      await expect(service.getWithDetails(1)).rejects.toThrow('Database error');
    });
  });


