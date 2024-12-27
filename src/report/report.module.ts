import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { ReportRepository } from './report.repository';
import { MyReportController } from './my-report.controller';

@Module({
  controllers: [ReportController, MyReportController],
  providers: [ReportService, ReportRepository]
})
export class ReportModule {}
