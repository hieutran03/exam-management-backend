import { Injectable } from '@nestjs/common';
import { TeachersRepository } from './teachers.repository';
import RegisterDto from 'src/models/authentication/dtos/register.dto';

@Injectable()
export class TeachersService {
  constructor(private teacherRepository: TeachersRepository){}
  find(){
    return this.teacherRepository.getAll();
  }
  findByUserName(username: string){
    return this.teacherRepository.getByUsername(username);
  }
  create(teacher: RegisterDto){
    return this.teacherRepository.create(teacher);
  }
  
  updatePassword(id: number, password: string){
    return this.teacherRepository.update(id, {password})
  }
}
