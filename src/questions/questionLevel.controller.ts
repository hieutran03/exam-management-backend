import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import PermissionGuard from 'src/core/roles/permission.guard';
import PermissionEnum from 'src/core/roles/permission.enum';
import { QuestionLevelService } from './questionLevel.service';

@Controller('question-levels')
export class QuestionLevelController {
  constructor(private readonly questionLevelService: QuestionLevelService) {}

  @Get()
  async getAllQuestionLevels() {
    return await this.questionLevelService.findAll().catch((error) => {
      throw error;
    });
  }

  @Get(':id')
  async getQuestionLevelById(@Param('id', ParseIntPipe) id: number) {
    return await this.questionLevelService.findById(id).catch((error) => {
      throw error;
    });
  }

  @UseGuards(PermissionGuard(PermissionEnum.QUESTION_MODIFY))
  @Post()
  async createQuestionLevel(@Body('name') name: string) {
    return await this.questionLevelService.create(name).catch((error) => {
      throw error;
    });
  }

  @UseGuards(PermissionGuard(PermissionEnum.QUESTION_MODIFY))
  @Put(':id')
  async updateQuestionLevel(@Param('id', ParseIntPipe) id: number, @Body('name') name: string) {
    return await this.questionLevelService.update(id, name).catch((error) => {
      throw error;
    });
  }

  @UseGuards(PermissionGuard(PermissionEnum.QUESTION_MODIFY))
  @Delete(':id')
  async deleteQuestionLevel(@Param('id', ParseIntPipe) id: number) {
    return await this.questionLevelService.delete(id).catch((error) => {
      throw error;
    });
  }
}