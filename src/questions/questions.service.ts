import { HttpException, Injectable } from '@nestjs/common';
import QuestionsRepository from './questions.repository';
import CreateQuestionDTO from 'src/models/questions/dtos/create-question.dto';
import UpdateQuestionDTO from 'src/models/questions/dtos/update-question.dto';
import { IGetByIdMethod } from 'src/common/interface/getByIdMethod.interface';
import { GetExamDto } from 'src/models/exams/dtos/get-exam.dto';

@Injectable()
export class QuestionsService implements IGetByIdMethod{
  constructor(private questionRepository: QuestionsRepository) {}
  findAll(data: GetExamDto){
    try {
      return this.questionRepository.findAllWithDetals(data);
    } catch (error) {
      throw error; 
    }
  }
  getById(id: number){
    try {
      return this.questionRepository.findById(id);
    } catch (error) {
      throw error;
    }
  }
  findByCourseId(course_id: number){
    try {
      return this.questionRepository.findByCourseId(course_id);
    } catch (error) {
      throw error;
    }
  }
  findWithDetails(id: number){
    try {
      return this.questionRepository.findWithDetails(id);
    } catch (error) {
      throw error;
    }
  }
  create(teacher_id: number, questionData: CreateQuestionDTO){
    try {
      return this.questionRepository.create(teacher_id, questionData);
    } catch (error) {
      throw error;
    }
  }
  async update(id: number, questionData: UpdateQuestionDTO){
    try {
      const question = this.questionRepository.update(id, questionData);
      if (!question) {
        throw new HttpException('Question not found', 404);
      }
    } catch (error) {
      throw error;
    }
  }
  async delete(id: number){
    try {
      const question = this.questionRepository.delete(id);
      if (!question) {
        throw new HttpException('Question not found', 404);
      }
      return question
    } catch (error) {
      throw error;
    }
  }
}
