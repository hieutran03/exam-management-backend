import { Test, TestingModule } from '@nestjs/testing';
import { ExamResultRepository } from './exam-result.repository';
import DatabaseService from '../../src/core/database/database.service';
import { BadRequestException } from '@nestjs/common';
import PostgresErrorCode from '../../src/core/database/postgresErrorCode.enum';
import { PoolClient } from 'pg';

const mockDatabaseService: Partial<Record<keyof DatabaseService, jest.Mock>> = {
  runQuery: jest.fn(),
  getPoolClient: jest.fn(),
};

describe('ExamResultRepository', () => {
    let repository: ExamResultRepository;
    let databaseService: jest.Mocked<DatabaseService>;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ExamResultRepository,
          { provide: DatabaseService, useValue: mockDatabaseService },
        ],
      }).compile();


  
      repository = module.get<ExamResultRepository>(ExamResultRepository);
      databaseService = module.get(DatabaseService);
    });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAllByExamId', () => {
    it('should return all results for a given exam ID', async () => {
        const exam_id = 1;
        const mockRows = [{ student_id: 1, score: 95 }, { student_id: 2, score: 85 }];
        databaseService.runQuery.mockResolvedValue({
          rows: mockRows,
          command: 'SELECT',
          rowCount: mockRows.length,
          oid: null,
          fields: [],
        });
      
        const result = await repository.findAllByExamId(exam_id);
        expect(result).toEqual(mockRows);
        expect(databaseService.runQuery).toHaveBeenCalledWith(
          `
        select * 
        from exam_result
        where exam_id = $1
        order by student_id asc;
        `,
          [exam_id],
        );
      });
      
  });

  describe('findAllByStudentId', () => {
    it('should return all results for a given student ID', async () => {
      const student_id = 1;
      const mockRows = [{ exam_id: 1, score: 95 }, { exam_id: 2, score: 85 }];
      databaseService.runQuery.mockResolvedValue({
        rows: mockRows,
        command: 'SELECT',
        rowCount: mockRows.length,
        oid: null,
        fields: [],
      });

      const result = await repository.findAllByStudentId(student_id);
      expect(result).toEqual(mockRows);
      expect(databaseService.runQuery).toHaveBeenCalledWith(
        `
        select * from exam_result
        where student_id = $1
        order by exam_id asc;
        `,
        [student_id],
      );
    });
  });

});
