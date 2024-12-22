import { Injectable } from '@nestjs/common';
import { GradeRepository } from './grade.repository';

import { CreateGradeDTO } from 'src/models/grade/dtos/create-grade.dto';
import { UpdateGradeDTO } from 'src/models/grade/dtos/update-grade.dto';

@Injectable()
export class GradeService {
  constructor(private readonly gradeRepository: GradeRepository) {}

  // async findAll() {
  //   return await this.gradeRepository.findAll().catch((error) => {
  //     throw error;
  //   });
  // }

  // async findByOptions(options: GetGradeDTO) {
  //   return await this.gradeRepository.findByOptions(options).catch((error) => {
  //     throw error;
  //   });
  // }

  // async create(data: CreateGradeDTO) {
  //   return await this.gradeRepository.create(data).catch((error) => {
  //     throw error;
  //   });
  // }

  // async createMany(data: CreateGradeDTO[]) {
  //   return await this.gradeRepository.createMany(data).catch((error) => {
  //     throw error;
  //   });
  // }

  // async update(data: UpdateGradeDTO) {
  //   return await this.gradeRepository.update(data).catch((error) => {
  //     throw error;
  //   });
  // }

  // async updateMany(data: UpdateGradeDTO[]) {
  //   return await this.gradeRepository.updateMany(data).catch((error) => {
  //     throw error;
  //   });
  // }

  // async delete(data: GetGradeDTO) {
  //   return await this.gradeRepository.delete(data).catch((error) => {
  //     throw error;
  //   });
  // }
  async findAllByExamId(exam_id: number) {
    return await this.gradeRepository.findAllByExamId(exam_id).catch((error) => {
      throw error;
    });
  }

  async findAllByStudentId(student_id: number) {
    return await this.gradeRepository.findAllByStudentId(student_id).catch((error) => {
      throw error;
    });
  }

  async findByStudentIdAndExamId(exam_id: number, student_id: number) {
    return await this.gradeRepository.findByStudentIdAndExamId(exam_id, student_id).catch((error) => {
      throw error;
    });
  }

  async create(exam_id: number, data: CreateGradeDTO) {
    return await this.gradeRepository.create(exam_id, data).catch((error) => {
      throw error;
    });
  }

  async createMany(exam_id: number, data: CreateGradeDTO[]) {
    return await this.gradeRepository.createMany(exam_id, data).catch((error) => {
      throw error;
    });
  }
}
