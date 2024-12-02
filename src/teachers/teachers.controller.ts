import { Controller, Get } from '@nestjs/common';
import { TeachersService } from './teachers.service';
@Controller('teachers')
export class TeachersController {
  constructor(private teacherService: TeachersService){}
  
  @Get()
  getAllTeacher(){
    return this.teacherService.find();
  }
}
