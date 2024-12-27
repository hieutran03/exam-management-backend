import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import DatabaseService from './database.service';

import { QueryResult } from 'pg';

describe('DatabaseService', () => {
  let databaseService: DatabaseService;
  let mockPool: jest.Mocked<Pool>;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(async () => {
    mockPool = {
      query: jest.fn(),
      connect: jest.fn(),
    } as unknown as jest.Mocked<Pool>;

    mockLogger = {
      log: jest.fn(),
      warn: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseService,
        { provide: Logger, useValue: mockLogger },
        { provide: 'CONNECTION_POOL', useValue: mockPool },
      ],
    }).compile();

    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(databaseService).toBeDefined();
  });

  
  
});
