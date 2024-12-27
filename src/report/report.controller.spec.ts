import { Test, TestingModule } from '@nestjs/testing';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

const mockReportService = {
  getAll: jest.fn(),
  getDetailsBySemesterSchoolYearId: jest.fn(),
  createReport: jest.fn(),
};

describe('ReportController', () => {
  let controller: ReportController;
  let service: ReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [
        {
          provide: ReportService,
          useValue: mockReportService,
        },
      ],
    }).compile();

    controller = module.get<ReportController>(ReportController);
    service = module.get<ReportService>(ReportService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllReport', () => {
    it('should return all reports', async () => {
      const result = [{ id: 1, name: 'Report 1' }];
      jest.spyOn(service, 'getAll').mockResolvedValue(result);

      expect(await controller.getAllReport()).toBe(result);
      expect(service.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getReportDetailsById', () => {
    it('should return report details by semester school year ID', async () => {
      const ssy_id = 1;
      const user_id = 2;
      const request: any = { user: { id: user_id } };
      const result = { id: 1, details: 'Details of Report' };
      jest.spyOn(service, 'getDetailsBySemesterSchoolYearId').mockResolvedValue(result);

      expect(await controller.getReportDetailsById(ssy_id, request)).toBe(result);
      expect(service.getDetailsBySemesterSchoolYearId).toHaveBeenCalledWith(ssy_id, user_id);
    });
  });

  describe('createReport', () => {
    it('should create a new report', async () => {
      const ssy_id = 1;
      const user_id = 2;
      const request: any = { user: { id: user_id } };
      const result = { id: 1, message: 'Report created successfully' };
      jest.spyOn(service, 'createReport').mockResolvedValue(result);

      expect(await controller.createReport(ssy_id, request)).toBe(result);
      expect(service.createReport).toHaveBeenCalledWith(ssy_id, user_id);
    });
  });
});
