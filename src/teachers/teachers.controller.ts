import { Controller, Get, Patch, Param, Body, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { ChangePasswordDTO } from 'src/models/teachers/dtos/change-password.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { TeacherDTO } from 'src/models/teachers/dtos/teacher.dto';
import PermissionGuard from 'src/core/roles/permission.guard';
import PermissionEnum from 'src/core/roles/permission.enum';

@Serialize(TeacherDTO)
@Controller('teachers')
export class TeachersController {
  constructor(private teacherService: TeachersService){}
  
  @Get('')
  getAllTeacher(){
    return this.teacherService.find();
  }

  @UseGuards(PermissionGuard(PermissionEnum.TEACHER_READ))
  @Get('/:id')
  getTeacherById(@Param('id', ParseIntPipe) id: number){
    return this.teacherService.findById(id);
  }

  @UseGuards(PermissionGuard(PermissionEnum.TEACHER_READ))
  @Get('/:id/details')
  getTeacherWithDetails(@Param('id', ParseIntPipe) id: number){
    return this.teacherService.findWithDetails(id);
  }

  @UseGuards(PermissionGuard(PermissionEnum.TEACHER_MODIFY))
  @Patch('/password/:id')
  changePassword(
    @Param('id', ParseIntPipe)id: number,
    @Body() body: ChangePasswordDTO){
    return this.teacherService.updatePassword(id, body.password);
  }
}
