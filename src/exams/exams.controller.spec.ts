import { Test, TestingModule } from '@nestjs/testing';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';
import  CreateExamDTO  from '../../src/models/exams/dtos/create-exam.dto';
import { UpdateExamDTO } from '../../src/models/exams/dtos/update-exam.dto';

const mockExamsService = {
  getAll: jest.fn(),
  getDetailsById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('ExamsController', () => {
  let controller: ExamsController;
  let service: ExamsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamsController],
      providers: [
        {
          provide: ExamsService,
          useValue: mockExamsService,
        },
      ],
    }).compile();

    controller = module.get<ExamsController>(ExamsController);
    service = module.get<ExamsService>(ExamsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllExams', () => {
    it('should return all exams', async () => {
      const result = [{ id: 1, name: 'Exam 1' }];
      jest.spyOn(service, 'getAll').mockResolvedValue(result);

      expect(await controller.getAllExams()).toBe(result);
      expect(service.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getExamDetailsById', () => {
    it('should return exam details by ID', async () => {
      const id = 1;
      const result = { id, name: 'Exam 1' };
      jest.spyOn(service, 'getDetailsById').mockResolvedValue(result);

      expect(await controller.getExamDetailsById(id)).toBe(result);
      expect(service.getDetailsById).toHaveBeenCalledWith(id);
    });
  });

  describe('createExam', () => {
    it('should create a new exam', async () => {
      const userId = 1;
      const request = { user: { id: userId } } as any;
      const createExamDTO: CreateExamDTO = { total_score:10,time:10,exam_date:new Date(),course_id:1,semester_school_year_id:1,question_ids:[1,2] };
      const result = { id: 1, ...createExamDTO };
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.createExam(createExamDTO, request)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(userId, createExamDTO);
    });
  });

  describe('updateExam', () => {
    it('should update an exam', async () => {
      const id = 1;
      const updateExamDTO: UpdateExamDTO = { total_score:10,time:10,exam_date:new Date(),course_id:1,semester_school_year_id:1,question_ids:[1,2] };
      const result = { id, ...updateExamDTO };
      jest.spyOn(service, 'update').mockResolvedValue(undefined); 

    await controller.updateExam(id, updateExamDTO);
      expect(service.update).toHaveBeenCalledWith(id, updateExamDTO);
    });
  });

  describe('deleteExam', () => {
    it('should delete an exam', async () => {
      const id = 1;
      const result = { success: true };
      jest.spyOn(service, 'delete').mockResolvedValue(result);

      expect(await controller.deleteExam(id)).toBe(result);
      expect(service.delete).toHaveBeenCalledWith(id);
    });
  });
});
