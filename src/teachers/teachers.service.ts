import { Injectable } from '@nestjs/common';
import { TeachersRepository } from './teachers.repository';

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
