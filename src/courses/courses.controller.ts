import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDTO } from 'src/models/courses/dtos/create-course.dto';
import { UpdateCourseDTO } from 'src/models/courses/dtos/update-course.dto';
import PermissionGuard from 'src/core/roles/permission.guard';
import PermissionEnum from 'src/core/roles/permission.enum';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}
  @Get()
  getAll() {
    return this.coursesService.getAll();
  }

  @Get(':id')
  getById(id: number) {
    return this.coursesService.getById(id);
  }

  @UseGuards(PermissionGuard(PermissionEnum.TEACHER_MODIFY))
  @Post()
  create(@Body()course: CreateCourseDTO) {
    return this.coursesService.create(course);
  }

  @UseGuards(PermissionGuard(PermissionEnum.TEACHER_MODIFY))
  @Put(':id')
  update(@Param('id')id: number, @Body()course: UpdateCourseDTO) {
    return this.coursesService.update(id, course);
  }

  @Get(':id/course-class')
  getAllCourseClass(@Param('id')courseId: number) {
    return this.coursesService.getAllCourseClass(courseId);
  }

  @UseGuards(PermissionGuard(PermissionEnum.TEACHER_MODIFY))
  @Post(':id/course-class')
  createCourseClass(@Param('id')courseId: number, @Body()data: any) {
    return this.coursesService.createCourseClass(courseId, data);
  }

  @UseGuards(PermissionGuard(PermissionEnum.TEACHER_MODIFY))
  @Put(':id/course-class/:class_id')
  updateCourseClass(@Param('id')courseId: number, @Param('class_id')class_id, @Body()data: any) {
    return this.coursesService.updateCourseClass(courseId, class_id, data);
  }
}
