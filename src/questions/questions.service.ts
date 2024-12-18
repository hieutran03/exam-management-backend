import { HttpException, Injectable } from '@nestjs/common';
import QuestionsRepository from './questions.repository';
import CreateQuestionDTO from 'src/models/questions/dtos/create-question.dto';
import UpdateQuestionDTO from 'src/models/questions/dtos/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private questionRepository: QuestionsRepository) {}
  //logic for api: /questions/*(permission-based)
  findAll(){
    try {
      return this.questionRepository.findAllWithDetails();
    } catch (error) {
      throw error; 
    }
  }
  findById(id: number){
    try {
      return this.questionRepository.findById(id);
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
      return this.questionRepository.update(id, questionData);
    } catch (error) {
      throw error;
    }
  }
  async delete(id: number){
    try {
      return this.questionRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }

  //logic for api: questions/my-questions/*
  async findAllMyQuestions(teacher_id: number){
    try {
      return this.questionRepository.findAllMyQuestionsWithDetals(teacher_id);
    } catch (error) {
      throw error;
    }
  }
  
  // async findMyQuestionById(teacher_id: number, id: number){
  //   try {
  //     const question = await this.findById(id);
  //     if (!question) {
  //       throw new HttpException('Question not found', 404);
  //     }
  //     if(teacher_id !== question.teacher_id){
  //       throw new HttpException('Unauthorized', 401);
  //     }
  //     return question;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async findMyQuestionWithDetails(teacher_id: number, id: number){
    try {
      const question = await this.findWithDetails(id);
      if (!question) {
        throw new HttpException('Question not found', 404);
      }
      if(teacher_id !== question.teacher_id){
        throw new HttpException('Unauthorized', 401);
      }
      return question;
    } catch (error) {
      throw error;
    }
  }

  //Note: create function will be shared with the permission-based api
  
  async updateMyQuestion(teacher_id: number, question_id: number, questionData: CreateQuestionDTO){
    try {
      const question = await this.questionRepository.findById(question_id);
      if (!question) {
        throw new HttpException('Question not found', 404);
      }
      if(teacher_id !== question.teacher_id){
        throw new HttpException('Unauthorized', 401);
      }
      return this.questionRepository.update(question_id, questionData);
    } catch (error) {
      throw error;
    }
  }

  async deleteMyQuestion(teacher_id: number, id: number){
    try {
      const question = await this.questionRepository.findById(id);
      if (!question) {
        throw new HttpException('Question not found', 404);
      }
      if(teacher_id !== question.teacher_id){
        throw new HttpException('Unauthorized', 401);
      }
      return this.questionRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
