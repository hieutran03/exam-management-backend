import { Injectable } from '@nestjs/common';
import { TeachersRepository } from './teachers.repository';
import RegisterDto from 'src/models/authentication/dtos/register.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TeachersService {
  constructor(
    private teacherRepository: TeachersRepository,
    private configService: ConfigService,
  ){}
  find(){
    return this.teacherRepository.getAll();
  }
  findById(id: number){
    return this.teacherRepository.getById(id);
  }
  findByUserName(username: string){
    return this.teacherRepository.getByUsername(username);
  }
  create(teacher: RegisterDto){
    return this.teacherRepository.create(teacher);
  }
  
  async updatePassword(id: number, password: string){
    password = await bcrypt.hash(password, parseInt(this.configService.get('BCRYPT_SALT_ROUNDS')));
    return this.teacherRepository.update(id, {password});
  }
}
