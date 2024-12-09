import { Controller, Get, Patch, Param, Body, ParseIntPipe } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { ChangePasswordDTO } from 'src/models/teachers/dtos/change-password.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { TeacherDTO } from 'src/models/teachers/dtos/teacher.dto';

@Serialize(TeacherDTO)
@Controller('teachers')
export class TeachersController {
  constructor(private teacherService: TeachersService){}
  
  @Get()
  getAllTeacher(){
    return this.teacherService.find();
  }

  @Patch('/password/:id')
  changePassword(@Param('id', ParseIntPipe)id: number, @Body() body: ChangePasswordDTO){
    return this.teacherService.updatePassword(id, body.password);
  }
}
