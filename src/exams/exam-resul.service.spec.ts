import { Test, TestingModule } from '@nestjs/testing';
import { ExamResultService } from './exam-result.service';
import { ExamResultRepository } from './exam-result.repository';
import { CreateExamResultDTO } from '../../src/models/exams/dtos/create-exam-result.dto';
import { UpdateExamResultDTO } from '../../src/models/exams/dtos/update-exam-result.dto';

const mockExamResultRepository = {
  findAllByExamId: jest.fn(),
  findAllByStudentId: jest.fn(),
  findByStudentIdAndExamId: jest.fn(),
  createMany: jest.fn(),
  updateMany: jest.fn(),
  deleteByExamIdAndStudentId: jest.fn(),
};

describe('ExamResultService', () => {
  let service: ExamResultService;
  let repository: ExamResultRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamResultService,
        {
          provide: ExamResultRepository,
          useValue: mockExamResultRepository,
        },
      ],
    }).compile();

    service = module.get<ExamResultService>(ExamResultService);
    repository = module.get<ExamResultRepository>(ExamResultRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllByExamId', () => {
    it('should return all results for a given exam ID', async () => {
      const exam_id = 1;
      const result = [{ id: 1, score: 90 }];
      jest.spyOn(repository, 'findAllByExamId').mockResolvedValue(result);

      expect(await service.findAllByExamId(exam_id)).toBe(result);
      expect(repository.findAllByExamId).toHaveBeenCalledWith(exam_id);
    });
  });

  describe('findAllByStudentId', () => {
    it('should return all results for a given student ID', async () => {
      const student_id = 1;
      const result = [{ id: 1, score: 85 }];
      jest.spyOn(repository, 'findAllByStudentId').mockResolvedValue(result);

      expect(await service.findAllByStudentId(student_id)).toBe(result);
      expect(repository.findAllByStudentId).toHaveBeenCalledWith(student_id);
    });
  });

  describe('findByStudentIdAndExamId', () => {
    it('should return the result for a specific student and exam ID', async () => {
      const exam_id = 1;
      const student_id = 2;
      const result = { id: 1, score: 88 };
      jest.spyOn(repository, 'findByStudentIdAndExamId').mockResolvedValue(result);

      expect(await service.findByStudentIdAndExamId(exam_id, student_id)).toBe(result);
      expect(repository.findByStudentIdAndExamId).toHaveBeenCalledWith(exam_id, student_id);
    });
  });

  describe('createMany', () => {
    it('should create multiple exam results', async () => {
      const exam_id = 1;
      const data: CreateExamResultDTO[] = [
        { student_id: 1, student_name: 'Tuan', score: 95, score_text: 'chin muoi lam', note: 'gioi' },
        { student_id: 2, student_name: 'Thuy', score: 100, score_text: 'mot tram diem', note: 'xinh dep hoc gioi' },
      ];
      mockExamResultRepository.createMany.mockResolvedValue('Success');

      await service.createMany(exam_id, data);
      expect(repository.createMany).toHaveBeenCalledWith(exam_id, data);
    });
  });

  describe('updateMany', () => {
    it('should update multiple exam results', async () => {
      const exam_id = 1;
      const data: UpdateExamResultDTO[] = [
        { student_id: 1, student_name: 'Tuan', score: 95, score_text: 'chin muoi lam', note: 'gioi' },
        { student_id: 2, student_name: 'Thuy', score: 100, score_text: 'mot tram diem', note: 'xinh dep hoc gioi' },
      ];
      mockExamResultRepository.updateMany.mockResolvedValue('Updated');

      await service.updateMany(exam_id, data);
      expect(repository.updateMany).toHaveBeenCalledWith(exam_id, data);
    });
  });

  describe('delete', () => {
    it('should delete a specific exam result', async () => {
      const exam_id = 1;
      const student_id = 2;
      const result = { success: true };
      jest.spyOn(repository, 'deleteByExamIdAndStudentId').mockResolvedValue(result);

      expect(await service.delete(exam_id, student_id)).toBe(result);
      expect(repository.deleteByExamIdAndStudentId).toHaveBeenCalledWith(exam_id, student_id);
    });
  });
});
