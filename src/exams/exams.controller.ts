import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ExamsService } from './exams.service';
import CreateExamDTO from 'src/models/exams/dtos/create-exam.dto';
import JwtAuthenticationGuard from 'src/core/authentication/jwtAuthentication.guard';
import { RequestWithUser } from 'src/core/authentication/requestWithUsers.interface';
import PermissionGuard from 'src/core/roles/permission.guard';
import PermissionEnum from 'src/core/roles/permission.enum';
import { UpdateExamDTO } from 'src/models/exams/dtos/update-exam.dto';
import { ExamResultService } from './exam-result.service';
import { CreateExamResultDTO } from 'src/models/exams/dtos/create-exam-result.dto';
import { UpdateExamResultDTO } from 'src/models/exams/dtos/update-exam-result.dto';
import { CreateStudentResultDTO } from 'src/models/exams/dtos/create-studtent-result.dto';
import { UpdateStudentResultDTO } from 'src/models/exams/dtos/update-student-result.dto';

@Controller('exams')
export class ExamsController {
  constructor(
    private readonly examsService: ExamsService,
    private readonly examResultService: ExamResultService,
  ) {}

  @UseGuards(PermissionGuard(PermissionEnum.EXAM_READ))
  @Get()
  async getAllExams(@Req() request) {
    try {
      let teacher_id = parseInt(request.query.teacher_id);
      if (!teacher_id) teacher_id = null;
      return await this.examsService.getAll(teacher_id);
    } catch (error) {
      throw new Error(error);
    }
  }
  @UseGuards(PermissionGuard(PermissionEnum.EXAM_READ))
  @Get(':id')
  async getExamDetailsById(@Param('id') id: number) {
    return await this.examsService.getDetailsById(id).catch((error) => {
      throw error;
    });
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  async createExam(
    @Body() data: CreateExamDTO,
    @Req() request: RequestWithUser,
  ) {
    const user = request.user;
    return await this.examsService.create(user.id, data).catch((error) => {
      throw error;
    });
  }

  @UseGuards(PermissionGuard(PermissionEnum.EXAM_MODIFY))
  @Put(':id')
  async updateExam(@Param('id') id: number, @Body() data: UpdateExamDTO) {
    return await this.examsService.update(id, data).catch((error) => {
      throw error;
    });
  }

  @UseGuards(PermissionGuard(PermissionEnum.EXAM_MODIFY))
  @Delete(':id')
  async deleteExam(@Param('id') id: number) {
    return await this.examsService.delete(id).catch((error) => {
      throw error;
    });
  }

  @UseGuards(PermissionGuard(PermissionEnum.GRADE_READ))
  @Get(':id/results')
  async getExamResults(@Param('id') id: number) {
    return await this.examResultService.findAllByExamId(id);
  }

  @UseGuards(PermissionGuard(PermissionEnum.GRADE_READ))
  @Get(':id/results/:studentId')
  async getStudentResult(
    @Param('id') id: number,
    @Param('studentId') student_id: number,
  ) {
    return await this.examResultService.findByStudentIdAndExamId(
      id,
      student_id,
    );
  }

  // @UseGuards(PermissionGuard(PermissionEnum.GRADE_MODIFY))
  // @Post(':id/results')
  // async createExamResults(
  //   @Param('id')id: number,
  //   @Body()data: CreateExamResultDTO[]
  // ){
  //   return await this.examResultService.createMany(id, data).catch((error) => {
  //     throw error;
  //   });
  // }

  // @UseGuards(PermissionGuard(PermissionEnum.GRADE_MODIFY))
  // @Put(':id/results')
  // async updateExamResults(
  //   @Param('id')id: number,
  //   @Body()data: UpdateExamResultDTO[]
  // ){
  //   return await this.examResultService.updateMany(id, data);
  // }

  @UseGuards(PermissionGuard(PermissionEnum.GRADE_MODIFY))
  @Post(':id/results')
  async createExamResult(
    @Param('id') id: number,
    @Body() data: CreateStudentResultDTO,
  ) {
    return await this.examResultService.create(id, data);
  }

  @UseGuards(PermissionGuard(PermissionEnum.GRADE_MODIFY))
  @Put(':id/results/:studentId')
  async updateExamResult(
    @Param('id') id: number,
    @Param('studentId') student_id: number,
    @Body() data: UpdateStudentResultDTO,
  ) {
    return await this.examResultService.update(id, student_id, data);
  }

  @UseGuards(PermissionGuard(PermissionEnum.GRADE_MODIFY))
  @Delete(':id/results/:studentId')
  async deleteExamResults(
    @Param('id') id: number,
    @Param('studentId') student_id: number,
  ) {
    return await this.examResultService.delete(id, student_id);
  }
}
