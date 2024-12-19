import { Body, Controller, Delete, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import { ExamsService } from './exams.service';
import JwtAuthenticationGuard from 'src/core/authentication/jwtAuthentication.guard';
import { RequestWithUser } from 'src/core/authentication/requestWithUsers.interface';
import { UpdateExamDTO } from 'src/models/exams/dtos/update-exam.dto';

@Controller('my-exams')
export class MyExamController{
  constructor(private readonly examsService: ExamsService){}
  @UseGuards(JwtAuthenticationGuard)
  @Get()
  async getAllMyExams(@Req() request: RequestWithUser){
    const user = request.user;
    return await this.examsService.getAllMyExams(user.id).catch((error) => {
      throw error;
    });
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get(':id')
  async getMyExamDetailsById(@Param('id')id: number, @Req() request: RequestWithUser){
    const user = request.user;
    return await this.examsService.getMyExamDetailsById(user.id, id).catch((error) => {
      throw error;
    });
  }

  @UseGuards(JwtAuthenticationGuard)
  @Put(':id')
  async updateExam(@Param('id')id: number, @Body()data: UpdateExamDTO, @Req() request: RequestWithUser){
    const user = request.user;
    return await this.examsService.updateMyExam(user.id, id, data).catch((error) => {
      throw error;
    });
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete(':id')
  async deleteExam(@Param('id')id: number, @Req() request: RequestWithUser){
    const user = request.user;
    return await this.examsService.deleteMyExam(user.id, id).catch((error) => {
      throw error;
    });
  }
}