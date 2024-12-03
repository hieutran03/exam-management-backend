import { Injectable, NotFoundException } from '@nestjs/common';
import DatabaseService from '../database/database.service';
import { plainToInstance } from 'class-transformer';
import { TeacherModel } from '../DAL/teachers/models/teachers.model';

@Injectable()
export class TeachersRepository {
  constructor(private readonly databaseService: DatabaseService) { }

  async getAll() {
    const databaseResponse = await this.databaseService.runQuery(`
      select * from teacher where deleted = 'false'
    `);

    return plainToInstance(TeacherModel, databaseResponse.rows);
  }
  async getById(id: number) {
    const databaseResponse = await this.databaseService.runQuery(
      `
      select * from teacher where id=$1
      `,
      [id],
    );
    const entity = databaseResponse.rows[0];
    if (!entity) {
      throw new NotFoundException();
    }
    return plainToInstance(TeacherModel, entity);
  }

  async delete(id: number) {
    const databaseResponse = await this.databaseService.runQuery(
      `
      update teacher
        set
          deleted = 'true'
        where id=$1
      `,
      [id],
    );
    if (databaseResponse.rowCount === 0) {
      throw new NotFoundException();
    }
  }
  async update(id: number, teacher: Partial<TeacherModel>) {
    // nullif(X, Y): if (X == Y) => return NULL else return X    
    // coalesce (A, B): if (A == NULL(Postgres)) => return B else return A
    // name = coalesce (nullif($1, ''), name) => means that if $1 == '' 
    // then name column will be ignored
    const databaseResponse = await this.databaseService.runQuery(
      `update teacher 
        set 
          name = coalesce (nullif($1, ''), name),
          username = coalesce (nullif($2, ''), username),
          password = coalesce (nullif($3, ''), password)
        where id = $4
      returning *;
      `,
      [
        teacher.name || '',
        teacher.username || '',
        teacher.password || '',
        id
      ],
    );
    if (databaseResponse.rowCount === 0) {
      throw new NotFoundException();
    }
  }
}
