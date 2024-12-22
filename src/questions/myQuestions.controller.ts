import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import CreateQuestionDTO from 'src/models/questions/dtos/create-question.dto';
import JwtAuthenticationGuard from 'src/core/authentication/jwtAuthentication.guard';
import { RequestWithUser } from 'src/core/authentication/requestWithUsers.interface';
import { QuestionsService } from './questions.service';
import { VerifyQuestionIdInterceptor } from './verifyQuestionId.interceptor';

@Controller('my-questions')
export default class MyQuestionsController {
  constructor(private questionService: QuestionsService) {}
  @UseGuards(JwtAuthenticationGuard)
  @Get()
  async getMyQuestions(@Req() request: RequestWithUser) {
    const teacher_id = request.user.id;
    return await this.questionService.findWithDetails(teacher_id).catch((error) => {
      throw error;
    });
  }

  @UseInterceptors(VerifyQuestionIdInterceptor)
  @UseGuards(JwtAuthenticationGuard)
  @Get(':id')
  async getMyParticularQuestion(@Param('id', ParseIntPipe) id: number, @Req() request: RequestWithUser) {
    return await this.questionService.findWithDetails(id).catch((error) => {
      throw error;
    });
  }

  @UseInterceptors(VerifyQuestionIdInterceptor)
  @UseGuards(JwtAuthenticationGuard)
  @Put(':id')
  updateMyQuestion(@Param('id', ParseIntPipe) id: number, @Body() data: CreateQuestionDTO, @Req() request: RequestWithUser) {
    const teacher_id = request.user.id;
    return this.questionService.update(id, data).catch((error) => {
      throw error;
    });
  }

  @UseInterceptors(VerifyQuestionIdInterceptor)
  @UseGuards(JwtAuthenticationGuard)
  @Delete(':id')
  deleteMyQuestion(@Param('id', ParseIntPipe) id: number, @Req() request: RequestWithUser) {
    const teacher_id = request.user.id;
    return this.questionService.delete(id).catch((error) => {
      throw error;
    });
  }
}