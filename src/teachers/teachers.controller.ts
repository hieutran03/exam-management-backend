import { Controller, Get, Patch, Param, Body, ParseIntPipe } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { ChangePasswordDTO } from 'src/DAL/teachers/dtos/change-password.dto';
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
