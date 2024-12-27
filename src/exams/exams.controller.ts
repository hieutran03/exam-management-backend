import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ExamsService } from './exams.service';
import CreateExamDTO from '../../src/models/exams/dtos/create-exam.dto';
import JwtAuthenticationGuard from '../../src/core/authentication/jwtAuthentication.guard';
import { RequestWithUser } from '../../src/core/authentication/requestWithUsers.interface';
import PermissionGuard from '../../src/core/roles/permission.guard';
import PermissionEnum from '../../src/core/roles/permission.enum';
import { UpdateExamDTO } from '../../src/models/exams/dtos/update-exam.dto';

@Controller('exams')
export class ExamsController {
  constructor(
    private readonly examsService: ExamsService
  ) {}

  @UseGuards(PermissionGuard(PermissionEnum.EXAM_READ))
  @Get()
  async getAllExams() {
    return await this.examsService.getAll().catch((error) => {
      throw error;
    });
  }
  @UseGuards(PermissionGuard(PermissionEnum.EXAM_READ))
  @Get(':id')
  async getExamDetailsById(@Param('id')id: number) {
    return await this.examsService.getDetailsById(id).catch((error) => {
      throw error;
    });
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  async createExam(@Body()data: CreateExamDTO, @Req() request: RequestWithUser) {
    const user = request.user;
    return await this.examsService.create(user.id, data).catch((error) => {
      throw error;
    });
  }

  @UseGuards(PermissionGuard(PermissionEnum.EXAM_MODIFY))
  @Put(':id')
  async updateExam(@Param('id')id: number, @Body()data: UpdateExamDTO) {
    return await this.examsService.update(id, data).catch((error) => {
      throw error;
    });
  }

  @UseGuards(PermissionGuard(PermissionEnum.EXAM_MODIFY))
  @Delete(':id')
  async deleteExam(@Param('id')id : number) {
    return await this.examsService.delete(id).catch((error) => {
      throw error;
    });
  }


}
