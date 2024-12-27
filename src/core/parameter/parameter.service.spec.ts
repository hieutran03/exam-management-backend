import { Test, TestingModule } from '@nestjs/testing';
import { ParameterService } from './parameter.service';
import ParameterRepository from './parameter.repository';

describe('ParameterService', () => {
  let service: ParameterService;
  let parameterRepository: jest.Mocked<ParameterRepository>;

  beforeEach(async () => {
    const mockParameterRepository = {
      getAll: jest.fn(),
      getById: jest.fn(),
      getByName: jest.fn(),
      update: jest.fn(),
      updateByName: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParameterService,
        { provide: ParameterRepository, useValue: mockParameterRepository },
      ],
    }).compile();

    service = module.get<ParameterService>(ParameterService);
    parameterRepository = module.get<ParameterRepository>(
      ParameterRepository,
    ) as jest.Mocked<ParameterRepository>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should call getAll from parameterRepository', async () => {
      parameterRepository.getAll.mockResolvedValueOnce([]);
      await service.getAll();
      expect(parameterRepository.getAll).toHaveBeenCalled();
    });

    it('should throw an error if getAll fails', async () => {
      parameterRepository.getAll.mockRejectedValueOnce(new Error('Database error'));
      await expect(service.getAll()).rejects.toThrow('Database error');
    });
  });

  describe('getById', () => {
    it('should call getById from parameterRepository with the correct id', async () => {
      const id = 1;
      parameterRepository.getById.mockResolvedValueOnce({ id, name: 'Test', value: 100 });
      await service.getById(id);
      expect(parameterRepository.getById).toHaveBeenCalledWith(id);
    });

    it('should throw an error if getById fails', async () => {
      parameterRepository.getById.mockRejectedValueOnce(new Error('Database error'));
      await expect(service.getById(1)).rejects.toThrow('Database error');
    });
  });

  describe('getByName', () => {
    it('should call getByName from parameterRepository with the correct name', async () => {
      const name = 'parameter_name';
      parameterRepository.getByName.mockResolvedValueOnce({ id: 1, name, value: 100 });
      await service.getByName(name);
      expect(parameterRepository.getByName).toHaveBeenCalledWith(name);
    });

    it('should throw an error if getByName fails', async () => {
      parameterRepository.getByName.mockRejectedValueOnce(new Error('Database error'));
      await expect(service.getByName('parameter_name')).rejects.toThrow('Database error');
    });
  });

  describe('update', () => {
    it('should call update from parameterRepository with the correct id and value', async () => {
      const id = 1;
      const value = 100;
      parameterRepository.update.mockResolvedValueOnce(true);
      await service.update(id, value);
      expect(parameterRepository.update).toHaveBeenCalledWith(id, value);
    });

    it('should throw an error if update fails', async () => {
      parameterRepository.update.mockRejectedValueOnce(new Error('Database error'));
      await expect(service.update(1, 100)).rejects.toThrow('Database error');
    });
  });

  describe('updateByName', () => {
    it('should call updateByName from parameterRepository with the correct name and value', async () => {
      const name = 'parameter_name';
      const value = 100;
      parameterRepository.updateByName.mockResolvedValueOnce(true);
      await service.updateByName(name, value);
      expect(parameterRepository.updateByName).toHaveBeenCalledWith(name, value);
    });

    it('should throw an error if updateByName fails', async () => {
      parameterRepository.updateByName.mockRejectedValueOnce(new Error('Database error'));
      await expect(service.updateByName('parameter_name', 100)).rejects.toThrow('Database error');
    });
  });
});
