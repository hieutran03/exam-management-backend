import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ExamsService } from './exams.service';
import JwtAuthenticationGuard from 'src/core/authentication/jwtAuthentication.guard';
import { RequestWithUser } from 'src/core/authentication/requestWithUsers.interface';
import { UpdateExamDTO } from 'src/models/exams/dtos/update-exam.dto';
import { VerifyExamIdInterceptor } from './verifyExamId.interceptor';
import { ExamResultService } from './exam-result.service';
import { UpdateExamResultDTO } from 'src/models/exams/dtos/update-exam-result.dto';
import { CreateExamResultDTO } from 'src/models/exams/dtos/create-exam-result.dto';

@UseInterceptors(VerifyExamIdInterceptor)
@Controller('my-exams')
export class MyExamController{
  constructor(
    private readonly examsService: ExamsService,
    private readonly examResultService: ExamResultService
  ){}
  @UseGuards(JwtAuthenticationGuard)
  @Get()
  async getAllMyExams(@Req() request: RequestWithUser){
    const user = request.user;
    return await this.examsService.getAll(user.id).catch((error) => {
      throw error;
    });
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get(':id')
  async getMyExamDetailsById(@Param('id')id: number){
    return await this.examsService.getDetailsById(id).catch((error) => {
      throw error;
    });
  }

  @UseGuards(JwtAuthenticationGuard)
  @Put(':id')
  async updateExam(@Param('id')id: number, @Body()data: UpdateExamDTO){
    return await this.examsService.update(id, data);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete(':id')
  async deleteExam(@Param('id')id: number){
    return await this.examsService.delete(id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get(':id/results')
  async getExamResults(@Param('id')id: number){
    return await this.examResultService.findAllByExamId(id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get(':id/results/:studentId')
  async getStudentResult(
    @Param('id')id: number,
    @Param('studentId')student_id: number,
  ){
    return await this.examResultService.findByStudentIdAndExamId(id, student_id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post(':id/results')
  async createExamResults(
    @Param('id')id: number,
    @Body()data: CreateExamResultDTO[]
  ){
    return await this.examResultService.createMany(id, data).catch((error) => {
      throw error;
    });
  }

  @UseGuards(JwtAuthenticationGuard)
  @Put(':id/results')
  async updateExamResults(
    @Param('id')id: number,
    @Body()data: UpdateExamResultDTO[]
  ){
    return await this.examResultService.updateMany(id, data);
  }


  @UseGuards(JwtAuthenticationGuard)
  @Delete(':id/results/:studentId')
  async deleteExamResults(
    @Param('id')id: number,
    @Param('studentId')student_id: number
  ){
    return await this.examResultService.delete(id, student_id);
  }
}