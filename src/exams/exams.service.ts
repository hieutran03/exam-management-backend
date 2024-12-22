import { HttpException, Injectable } from '@nestjs/common';
import ExamsRepository from './exams.repository';
import CreateExamDTO from 'src/models/exams/dtos/create-exam.dto';
import { UpdateExamDTO } from 'src/models/exams/dtos/update-exam.dto';
import { IGetByIdMethod } from 'src/common/interface/getByIdMethod.interface';

@Injectable()
export class ExamsService implements IGetByIdMethod {
  constructor(
    private readonly examsRepository: ExamsRepository,
  ) {}
  async getAll(teacher_id?: number) {
    return await this.examsRepository.getAll(teacher_id).catch((error) => {
      throw error;
    });
  }

  async getById(id: number) {
    return await this.examsRepository.getById(id).catch((error=>{
      throw error;
    }));
  }

  async getDetailsById(id: number) {
    return await this.examsRepository.getDetailsById(id).catch((error) => {
      throw error;
    });
  }

  async create(teacher_id: number, data: CreateExamDTO) {
    return await this.examsRepository.create(teacher_id, data).catch((error) => {
      throw error;
    });
  }

  async update(id: number, data: UpdateExamDTO) {
    const exam = await this.examsRepository.update(id, data)
    if(!exam){
      throw new HttpException('Exam not found', 404);
    }
  }

  async delete(id: number) {
    const exam = await this.examsRepository.delete(id)
    if(!exam){
      throw new HttpException('Exam not found', 404);
    }
    return exam;
  }
}
