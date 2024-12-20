import { Injectable } from '@nestjs/common';
import { TeachersRepository } from './teachers.repository';
import RegisterDto from 'src/models/authentication/dtos/register.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UpdateTeacherDTO } from 'src/models/teachers/dtos/update-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(
    private teacherRepository: TeachersRepository,
    private configService: ConfigService,
  ){}
  async find(){
    return this.teacherRepository.getAll();
  }
  async findById(id: number){
    return this.teacherRepository.getById(id);
  }
  async findByUserName(username: string){
    return this.teacherRepository.getByUsername(username);
  }
  async findWithDetails(id: number){
    return this.teacherRepository.getWithDetails(id);
  }
  async create(teacher: RegisterDto){
    return this.teacherRepository.create(teacher);
  }
  
  async updatePassword(id: number, password: string){
    password = await bcrypt.hash(password, parseInt(this.configService.get('BCRYPT_SALT_ROUNDS')));
    return this.teacherRepository.update(id, {password});
  }

  update(id: number, teacher: UpdateTeacherDTO){
    return this.teacherRepository.update(id, teacher);
  }
}
