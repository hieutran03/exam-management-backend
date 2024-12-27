import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import DatabaseService from './core/database/database.service';
import { QueryResult } from 'pg'; 

describe('AppService', () => {
  let appService: AppService;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: DatabaseService,
          useValue: {
            runQuery: jest.fn(),
          },
        },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      expect(appService.getHello()).toBe('Hello World!');
    });
  });

  describe('getSemesters', () => {
    it('should return semesters from the database', async () => {
      const mockSemesters = [{ id: 1, name: 'Semester 1' }, { id: 2, name: 'Semester 2' }];
      const mockQueryResult: QueryResult = {
        rows: mockSemesters,
        command: 'SELECT',
        rowCount: mockSemesters.length,
        oid: null,
        fields: [],
      };

      jest.spyOn(databaseService, 'runQuery').mockResolvedValueOnce(mockQueryResult);

      const result = await appService.getSemesters();
      expect(databaseService.runQuery).toHaveBeenCalledWith(`select * from semester_school_year`);
      expect(result).toEqual(mockSemesters);
    });
  });

  describe('getCourses', () => {
    it('should return courses from the database', async () => {
      const mockCourses = [{ id: 1, name: 'Course 1' }, { id: 2, name: 'Course 2' }];
      const mockQueryResult: QueryResult = {
        rows: mockCourses,
        command: 'SELECT',
        rowCount: mockCourses.length,
        oid: null,
        fields: [],
      };

      jest.spyOn(databaseService, 'runQuery').mockResolvedValueOnce(mockQueryResult);

      const result = await appService.getCourses();
      expect(databaseService.runQuery).toHaveBeenCalledWith(`select * from course`);
      expect(result).toEqual(mockCourses);
    });
  });
});
