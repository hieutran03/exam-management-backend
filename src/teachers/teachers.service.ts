import { Injectable } from '@nestjs/common';
import { TeachersRepository } from './teachers.repository';
import { TeacherModel } from 'src/DAL/teachers/models/teachers.model';
import { ChangePasswordDTO } from 'src/DAL/teachers/dtos/change-password.dto';
@Injectable()
export class TeachersService {
  constructor(private teacherRepository: TeachersRepository){}
  find(){
    return this.teacherRepository.getAll();
  }
  updatePassword(id: number, password: string){
    return this.teacherRepository.update(id, {password})
  }
}
