import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from './report.service';
import { ReportRepository } from './report.repository';

describe('ReportService', () => {
  let service: ReportService;
  let reportRepository: Partial<ReportRepository>;

  beforeEach(async () => {
    reportRepository = {
      getAll: jest.fn(),
      getAllByTeacher: jest.fn(),
      // getById: jest.fn(), // Uncomment if method is added back
      getDetailsBySemesterSchoolYearId: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        { provide: ReportRepository, useValue: reportRepository },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should call getAll from reportRepository', async () => {
      await service.getAll();
      expect(reportRepository.getAll).toHaveBeenCalled();
    });
  });

  describe('getAllByTeacher', () => {
    it('should call getAllByTeacher from reportRepository with the correct teacher_id', async () => {
      const teacher_id = 1;
      await service.getAllByTeacher(teacher_id);
      expect(reportRepository.getAllByTeacher).toHaveBeenCalledWith(teacher_id);
    });
  });


  describe('getDetailsBySemesterSchoolYearId', () => {
    it('should call getDetailsBySemesterSchoolYearId from reportRepository with the correct parameters', async () => {
      const ssy_id = 1;
      const teacher_id = 2;
      await service.getDetailsBySemesterSchoolYearId(ssy_id, teacher_id);
      expect(reportRepository.getDetailsBySemesterSchoolYearId).toHaveBeenCalledWith(ssy_id, teacher_id);
    });
  });

  describe('createReport', () => {
    it('should call create from reportRepository with the correct parameters', async () => {
      const ssy_id = 1;
      const teacher_id = 2;
      await service.createReport(ssy_id, teacher_id);
      expect(reportRepository.create).toHaveBeenCalledWith(ssy_id, teacher_id);
    });
  });
});
