import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: Partial<AppService>;

  beforeEach(async () => {
    appService = {
      getHello: jest.fn().mockReturnValue('Hello World!'),
      getSemesters: jest.fn().mockResolvedValue([{ id: 1, name: 'Fall 2023' }]),
      getCourses: jest.fn().mockResolvedValue([{ id: 1, name: 'Mathematics' }]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: appService }],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      const result = appController.getHello();
      expect(result).toBe('Hello World!');
      expect(appService.getHello).toHaveBeenCalled();
    });
  });

  describe('getSemesters', () => {
    it('should return an array of semesters', async () => {
      const result = await appController.getSemesters();
      expect(result).toEqual([{ id: 1, name: 'Fall 2023' }]);
      expect(appService.getSemesters).toHaveBeenCalled();
    });

    it('should throw an error if getSemesters fails', async () => {
      jest.spyOn(appService, 'getSemesters').mockRejectedValue(new Error('Database error'));
      await expect(appController.getSemesters()).rejects.toThrow('Database error');
    });
  });

  describe('getCourses', () => {
    it('should return an array of courses', async () => {
      const result = await appController.getCourses();
      expect(result).toEqual([{ id: 1, name: 'Mathematics' }]);
      expect(appService.getCourses).toHaveBeenCalled();
    });

    it('should throw an error if getCourses fails', async () => {
      jest.spyOn(appService, 'getCourses').mockRejectedValue(new Error('Database error'));
      await expect(appController.getCourses()).rejects.toThrow('Database error');
    });
  });
});
