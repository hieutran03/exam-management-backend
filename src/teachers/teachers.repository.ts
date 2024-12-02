import { Injectable } from '@nestjs/common';
import DatabaseService from '../database/database.service';
import { plainToInstance } from 'class-transformer';
import { TeacherModel } from './teachers.model';
 
@Injectable()
export class TeachersRepository {
  constructor(private readonly databaseService: DatabaseService) {}
 
  async getAll() {
    const databaseResponse = await this.databaseService.runQuery(`
      SELECT * FROM TEACHER
    `);

    return plainToInstance(TeacherModel,databaseResponse.rows);
  }

}
 
