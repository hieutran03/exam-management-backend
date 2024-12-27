import { Injectable } from '@nestjs/common';
import { CreateExamResultDTO } from '../../src/models/exams/dtos/create-exam-result.dto';
import { UpdateExamResultDTO } from '../../src/models/exams/dtos/update-exam-result.dto';
import { ExamResultRepository } from './exam-result.repository';
import { CreateStudentResultDTO } from '../../src/models/exams/dtos/create-studtent-result.dto';
import { UpdateStudentResultDTO } from '../../src/models/exams/dtos/update-student-result.dto';

@Injectable()
export class ExamResultService {
  constructor(private readonly examResultRepository: ExamResultRepository) {}

  async findAllByExamId(exam_id: number) {
    return await this.examResultRepository.findAllByExamId(exam_id).catch((error) => {
      throw error;
    });
  }

  async findAllByStudentId(student_id: number) {
    return await this.examResultRepository.findAllByStudentId(student_id).catch((error) => {
      throw error;
    });
  }

  async findByStudentIdAndExamId(exam_id: number, student_id: number) {
    return await this.examResultRepository.findByStudentIdAndExamId(exam_id, student_id).catch((error) => {
      throw error;
    });
  }

  // async create(exam_id: number, student_id: number,data: CreateStudentResultDTO) {
  //   return await this.examResultRepository.create(exam_id, student_id, data).catch((error) => {
  //     throw error;
  //   });
  // }

  async createMany(exam_id: number, data: CreateExamResultDTO[]) {
    return await this.examResultRepository.createMany(exam_id, data).catch((error) => {
      throw error;
    });
  }

  // async update(exam_id: number, student_id: number, data: UpdateStudentResultDTO) {
  //   return await this.examResultRepository.update(exam_id, student_id,data).catch((error) => {
  //     throw error;
  //   });
  // }

  async updateMany(exam_id, data: UpdateExamResultDTO[]) {
    return await this.examResultRepository.updateMany(exam_id, data).catch((error) => {
      throw error;
    });
  }

  async delete(exam_id: number, student_id: number) {
    return await this.examResultRepository.deleteByExamIdAndStudentId(exam_id, student_id).catch((error) => {
      throw error;
    });
  }
}
