import { HttpException, Injectable } from '@nestjs/common';
import ExamsRepository from './exams.repository';
import CreateExamDTO from 'src/models/exams/dtos/create-exam.dto';
import { UpdateExamDTO } from 'src/models/exams/dtos/update-exam.dto';

@Injectable()
export class ExamsService {
  constructor(
    private readonly examsRepository: ExamsRepository,
  ) {}
  async getAll() {
    return await this.examsRepository.getAll().catch((error) => {
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

  // for my-exams api
  async getAllMyExams(teacher_id: number) {
    return await this.examsRepository.getAllMyExams(teacher_id).catch((error) => {
      throw error;
    });
  }

  async getMyExamDetailsById(teacher_id: number, id: number) {
    const exam = await this.getById(id);
    if (exam.teacher_id !== teacher_id) {
      throw new HttpException('Unauthorized', 401);
    }
    return await this.examsRepository.getDetailsById(id)
  }

  async updateMyExam(teacher_id: number, id: number, data: UpdateExamDTO) {
    const exam = await this.getById(id);
    if (exam.teacher_id !== teacher_id) {
      throw new HttpException('Unauthorized', 401);
    }
    return await this.update(id, data);
  }

  async deleteMyExam(teacher_id: number, id: number) {
    const exam = await this.getById(id);
    if (exam.teacher_id !== teacher_id) {
      throw new HttpException('Unauthorized', 401);
    }
    return await this.delete(id);
  }
}
