import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import CreateQuestionDTO from '../../src/models/questions/dtos/create-question.dto';
import JwtAuthenticationGuard from '../../src/core/authentication/jwtAuthentication.guard';
import { RequestWithUser } from '../../src/core/authentication/requestWithUsers.interface';
import PermissionGuard from '../../src/core/roles/permission.guard';
import PermissionEnum from '../../src/core/roles/permission.enum';

@Controller('questions')
export class QuestionsController {
  constructor(
    private readonly questionService: QuestionsService,
  ) {}

  @UseGuards(PermissionGuard(PermissionEnum.QUESTION_READ))
  @Get()
  async getAllQuestions(@Req() request: RequestWithUser) {
    const teacher_id = request.query.teacher_id ? parseInt(request.query.teacher_id as string) : null;
    const course_id = request.query.course_id ? parseInt(request.query.course_id as string) : null;
    return await this.questionService.findAll({teacher_id,course_id}).catch((error) => {
      throw error;
    });
  }

  @UseGuards(PermissionGuard(PermissionEnum.QUESTION_READ))
  @Get(':id')
  async getQuestionById(@Param('id', ParseIntPipe)id: number) {
    return await this.questionService.findWithDetails(id).catch((error) => {
      throw error;
    });
  }

  // @UseGuards(PermissionGuard(PermissionEnum.QUESTION_READ))
  // @Get(':id/details')
  // async getQuestionWithDetails(@Param('id', ParseIntPipe)id: number) {
  //   return await this.questionService.findWithDetails(id).catch((error) => {
  //     throw error;
  //   });
  // }

  //share api for all teachers
  @UseGuards(JwtAuthenticationGuard)
  @Post()
  async createQuestion(@Body() data: CreateQuestionDTO, @Req() request: RequestWithUser) {
    const teacher_id = request.user.id;
    return await this.questionService.create(teacher_id,data).catch((error) => {
      throw error;
    });
  }

  @UseGuards(PermissionGuard(PermissionEnum.QUESTION_MODIFY))
  @Put(':id')
  async updateQuestion(@Param('id', ParseIntPipe) id: number, @Body() data: CreateQuestionDTO) {
    return await this.questionService.update(id, data).catch((error) => {
      throw error;
    });
  }

  @UseGuards(PermissionGuard(PermissionEnum.QUESTION_MODIFY))
  @Delete(':id')
  async deleteQuestion(@Param('id', ParseIntPipe) id: number) {
    return await this.questionService.delete(id).catch((error) => {
      throw error;
    });
  }
  
}
