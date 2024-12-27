import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsService } from './questions.service';
import QuestionsRepository from './questions.repository';
import CreateQuestionDTO from 'src/models/questions/dtos/create-question.dto';
import UpdateQuestionDTO from 'src/models/questions/dtos/update-question.dto';
import { GetExamDto } from 'src/models/exams/dtos/get-exam.dto';
import { HttpException } from '@nestjs/common';

describe('QuestionsService', () => {
  let service: QuestionsService;
  let questionsRepository: Partial<QuestionsRepository>;

  beforeEach(async () => {
    questionsRepository = {
      findAllWithDetals: jest.fn(),
      findById: jest.fn(),
      findByCourseId: jest.fn(),
      findWithDetails: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService,
        { provide: QuestionsRepository, useValue: questionsRepository },
      ],
    }).compile();

    service = module.get<QuestionsService>(QuestionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should call findAllWithDetals from questionRepository with correct data', async () => {
      const data: GetExamDto = { course_id:1,teacher_id:1 };
      await service.findAll(data);
      expect(questionsRepository.findAllWithDetals).toHaveBeenCalledWith(data);
    });
  });

  describe('getById', () => {
    it('should call findById from questionRepository with correct id', async () => {
      const id = 1;
      await service.getById(id);
      expect(questionsRepository.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('findByCourseId', () => {
    it('should call findByCourseId from questionRepository with correct course_id', async () => {
      const course_id = 1;
      await service.findByCourseId(course_id);
      expect(questionsRepository.findByCourseId).toHaveBeenCalledWith(course_id);
    });
  });

  describe('findWithDetails', () => {
    it('should call findWithDetails from questionRepository with correct id', async () => {
      const id = 1;
      await service.findWithDetails(id);
      expect(questionsRepository.findWithDetails).toHaveBeenCalledWith(id);
    });
  });

  describe('create', () => {
    it('should call create from questionRepository with correct teacher_id and questionData', async () => {
      const teacher_id = 1;
      const questionData: CreateQuestionDTO = { content: 'Test question',course_id:1,question_level_id:1 };
      await service.create(teacher_id, questionData);
      expect(questionsRepository.create).toHaveBeenCalledWith(teacher_id, questionData);
    });
  });

  describe('update', () => {
    it('should call update from questionRepository with correct id and questionData', async () => {
      const id = 1;
      const questionData: UpdateQuestionDTO = { content: 'Updated question',course_id:1,question_level_id:1 };
      jest.spyOn(questionsRepository, 'update').mockResolvedValueOnce({ id, ...questionData });

      await service.update(id, questionData);

      expect(questionsRepository.update).toHaveBeenCalledWith(id, questionData);
    });

    it('should throw HttpException if question is not found', async () => {
      const id = 1;
      const questionData: UpdateQuestionDTO = { content: 'Updated question',course_id:1,question_level_id:1 };
      jest.spyOn(questionsRepository, 'update').mockResolvedValueOnce(null);

      await expect(service.update(id, questionData)).rejects.toThrow(HttpException);
      await expect(service.update(id, questionData)).rejects.toThrow('Question not found');
    });
  });

  describe('delete', () => {
    it('should call delete from questionRepository with correct id', async () => {
      const id = 1;
      jest.spyOn(questionsRepository, 'delete').mockResolvedValueOnce({ id });

      const result = await service.delete(id);

      expect(questionsRepository.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual({ id });
    });

    it('should throw HttpException if question is not found', async () => {
      const id = 1;
      jest.spyOn(questionsRepository, 'delete').mockResolvedValueOnce(null);

      await expect(service.delete(id)).rejects.toThrow(HttpException);
      await expect(service.delete(id)).rejects.toThrow('Question not found');
    });
  });
});
