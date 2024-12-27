import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { ExamsService } from './exams.service';
import ExamsRepository from './exams.repository';
import CreateExamDTO from 'src/models/exams/dtos/create-exam.dto';
import { UpdateExamDTO } from 'src/models/exams/dtos/update-exam.dto';

describe('ExamsService', () => {
  let service: ExamsService;
  let examsRepository: jest.Mocked<Partial<ExamsRepository>>;

  beforeEach(async () => {
    examsRepository = {
      getAll: jest.fn(),
      getById: jest.fn(),
      getDetailsById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamsService,
        { provide: ExamsRepository, useValue: examsRepository },
      ],
    }).compile();

    service = module.get<ExamsService>(ExamsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should call getAll from examsRepository with teacher_id', async () => {
      const teacher_id = 1;
      examsRepository.getAll.mockResolvedValueOnce([]);
      await service.getAll(teacher_id);
      expect(examsRepository.getAll).toHaveBeenCalledWith(teacher_id);
    });

    it('should throw an error if getAll fails', async () => {
      examsRepository.getAll.mockRejectedValueOnce(new Error('Database error'));
      await expect(service.getAll(1)).rejects.toThrow('Database error');
    });
  });

  describe('getById', () => {
    it('should call getById from examsRepository with the correct id', async () => {
      const id = 1;
      examsRepository.getById.mockResolvedValueOnce({ id });
      await service.getById(id);
      expect(examsRepository.getById).toHaveBeenCalledWith(id);
    });

    it('should throw an error if getById fails', async () => {
      examsRepository.getById.mockRejectedValueOnce(new Error('Database error'));
      await expect(service.getById(1)).rejects.toThrow('Database error');
    });
  });

  describe('getDetailsById', () => {
    it('should call getDetailsById from examsRepository with the correct id', async () => {
      const id = 1;
      examsRepository.getDetailsById.mockResolvedValueOnce({ id });
      await service.getDetailsById(id);
      expect(examsRepository.getDetailsById).toHaveBeenCalledWith(id);
    });

    it('should throw an error if getDetailsById fails', async () => {
      examsRepository.getDetailsById.mockRejectedValueOnce(new Error('Database error'));
      await expect(service.getDetailsById(1)).rejects.toThrow('Database error');
    });
  });

  describe('create', () => {
    it('should call create from examsRepository with teacher_id and data', async () => {
      const teacher_id = 1;
      const data: CreateExamDTO = {
        total_score: 10,
        time: 10,
        exam_date: new Date(),
        course_id: 1,
        semester_school_year_id: 1,
        question_ids: [1, 2, 3],
      };
      examsRepository.create.mockResolvedValueOnce({ id: 1, ...data });
      await service.create(teacher_id, data);
      expect(examsRepository.create).toHaveBeenCalledWith(teacher_id, data);
    });

    it('should throw an error if create fails', async () => {
      const teacher_id = 1;
      const data: CreateExamDTO = {
        total_score: 10,
        time: 10,
        exam_date: new Date(),
        course_id: 1,
        semester_school_year_id: 1,
        question_ids: [1, 2, 3],
      };
      examsRepository.create.mockRejectedValueOnce(new Error('Database error'));
      await expect(service.create(teacher_id, data)).rejects.toThrow('Database error');
    });
  });

  describe('update', () => {
    it('should call update from examsRepository with id and data', async () => {
      const id = 1;
      const data: UpdateExamDTO = {
        total_score: 10,
        time: 10,
        exam_date: new Date(),
        course_id: 1,
        semester_school_year_id: 1,
        question_ids: [1, 2, 3],
      };
      examsRepository.update.mockResolvedValueOnce({ id, ...data });
      await service.update(id, data);
      expect(examsRepository.update).toHaveBeenCalledWith(id, data);
    });

    it('should throw HttpException if exam is not found', async () => {
      const id = 1;
      const data: UpdateExamDTO = {
        total_score: 10,
        time: 10,
        exam_date: new Date(),
        course_id: 1,
        semester_school_year_id: 1,
        question_ids: [1, 2, 3],
      };
      examsRepository.update.mockResolvedValueOnce(null);
      await expect(service.update(id, data)).rejects.toThrow(HttpException);
      await expect(service.update(id, data)).rejects.toThrow('Exam not found');
    });
  });

  describe('delete', () => {
    it('should call delete from examsRepository with the correct id', async () => {
      const id = 1;
      examsRepository.delete.mockResolvedValueOnce({ id });
      const result = await service.delete(id);
      expect(result).toEqual({ id });
      expect(examsRepository.delete).toHaveBeenCalledWith(id);
    });

    it('should throw HttpException if exam is not found', async () => {
      const id = 1;
      examsRepository.delete.mockResolvedValueOnce(null);
      await expect(service.delete(id)).rejects.toThrow(HttpException);
      await expect(service.delete(id)).rejects.toThrow('Exam not found');
    });
  });
});
