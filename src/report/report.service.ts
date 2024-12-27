import { Injectable } from '@nestjs/common';
import { ReportRepository } from './report.repository';

@Injectable()
export class ReportService {
  constructor(private reportRepository: ReportRepository) {}

  getAll(teacher_id?: number) {
    return this.reportRepository.getAll(teacher_id);
  }

  getAllByTeacher(teacher_id: number) {
    return this.reportRepository.getAllByTeacher(teacher_id);
  }

  // getById(id: number) {
  //   return this.reportRepository.getById(id);
  // }

  getDetailsBySemesterSchoolYearId(ssy_id: number, teacher_id: number) {
    return this.reportRepository.getDetailsBySemesterSchoolYearId(ssy_id, teacher_id);
  }

  createReport(ssy_id: number, teacher_id: number) {
    return this.reportRepository.create(ssy_id, teacher_id);
  }
}
