import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import  CreateQuestionDTO  from '../../src/models/questions/dtos/create-question.dto';

const mockQuestionsService = {
  findAll: jest.fn(),
  findWithDetails: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('QuestionsController', () => {
  let controller: QuestionsController;
  let service: QuestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionsController],
      providers: [
        {
          provide: QuestionsService,
          useValue: mockQuestionsService,
        },
      ],
    }).compile();

    controller = module.get<QuestionsController>(QuestionsController);
    service = module.get<QuestionsService>(QuestionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllQuestions', () => {
    it('should return all questions with optional filters', async () => {
      const request: any = { query: { teacher_id: '1', course_id: '2' } };
      const result = [{ id: 1, content: 'Question 1' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.getAllQuestions(request)).toBe(result);
      expect(service.findAll).toHaveBeenCalledWith({ teacher_id: 1, course_id: 2 });
    });
  });

  describe('getQuestionById', () => {
    it('should return question details by ID', async () => {
      const id = 1;
      const result = { id, content: 'Question 1' };
      jest.spyOn(service, 'findWithDetails').mockResolvedValue(result);

      expect(await controller.getQuestionById(id)).toBe(result);
      expect(service.findWithDetails).toHaveBeenCalledWith(id);
    });
  });

  describe('createQuestion', () => {
    it('should create a new question', async () => {
      const teacher_id = 1;
      const request: any = { user: { id: teacher_id } };
      const createQuestionDTO: CreateQuestionDTO = { content: 'New Question', course_id: 1,question_level_id:1 };
      const result = { id: 1, ...createQuestionDTO };
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.createQuestion(createQuestionDTO, request)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(teacher_id, createQuestionDTO);
    });
  });

  describe('updateQuestion', () => {
    it('should update a question', async () => {
      const id = 1;
      const updateQuestionDTO: CreateQuestionDTO = { content: 'Updated Question', course_id: 1,question_level_id:1 };
      const result = { id, ...updateQuestionDTO };
      jest.spyOn(service, 'update').mockResolvedValue(undefined); 

      await controller.updateQuestion(id, updateQuestionDTO);
      expect(service.update).toHaveBeenCalledWith(id, updateQuestionDTO);
    });
  });

  describe('deleteQuestion', () => {
    it('should delete a question', async () => {
      const id = 1;
      const result = { success: true };
      jest.spyOn(service, 'delete').mockResolvedValue(result);

      expect(await controller.deleteQuestion(id)).toBe(result);
      expect(service.delete).toHaveBeenCalledWith(id);
    });
  });
});
