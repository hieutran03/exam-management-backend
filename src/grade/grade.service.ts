import { Injectable } from '@nestjs/common';
import { GradeRepository } from './grade.repository';
import { GetGradeDTO } from 'src/models/grade/dtos/get-grade.dto';
import { CreateGradeDTO } from 'src/models/grade/dtos/create-grade.dto';
import { UpdateGradeDTO } from 'src/models/grade/dtos/update-grade.dto';

@Injectable()
export class GradeService {
  constructor(private readonly gradeRepository: GradeRepository) {}

  async findAll() {
    return await this.gradeRepository.findAll().catch((error) => {
      throw error;
    });
  }

  async findByOptions(options: GetGradeDTO) {
    return await this.gradeRepository.findByOptions(options).catch((error) => {
      throw error;
    });
  }

  async create(data: CreateGradeDTO) {
    return await this.gradeRepository.create(data).catch((error) => {
      throw error;
    });
  }

  async createMany(data: CreateGradeDTO[]) {
    return await this.gradeRepository.createMany(data).catch((error) => {
      throw error;
    });
  }

  async update(data: UpdateGradeDTO) {
    return await this.gradeRepository.update(data).catch((error) => {
      throw error;
    });
  }

  async updateMany(data: UpdateGradeDTO[]) {
    return await this.gradeRepository.updateMany(data).catch((error) => {
      throw error;
    });
  }

  async delete(data: GetGradeDTO) {
    return await this.gradeRepository.delete(data).catch((error) => {
      throw error;
    });
  }

}
