import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import DatabaseService from '../core/database/database.service';
import { TeacherModel } from '../models/teachers/teachers.model';
import RegisterDto from 'src/models/authentication/dtos/register.dto';
import { TeachersWithDetailsModel } from 'src/models/teachers/teachersWithDetails.model';
import PostgresErrorCode from 'src/core/database/postgresErrorCode.enum';

@Injectable()
export class TeachersRepository {
  constructor(private readonly databaseService: DatabaseService) { }

  async getAll() {
    try {
      const databaseResponse = await this.databaseService.runQuery(`
        select * from teacher where deleted = 'false'
      `);
      return databaseResponse.rows;
    } catch (error) {
      throw new Error(error);
    }
    
  }

  async getByUsername(username: string) {
    try {
      const databaseResponse = await this.databaseService.runQuery(
        `
          select * from teacher where username=$1
        `,
        [username]
      );
      if(databaseResponse.rows.length === 0) {
        return null;
      }
      return new TeacherModel(databaseResponse.rows[0]);
    } catch (error) {
      throw new Error(error);
    }
    
  }
  async getById(id: number) {
    try {
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
      return new TeacherModel(entity);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getWithDetails(id: number) {
    try {
      const userWithRoles = await this.databaseService.runQuery(
        `
        select t.id as id, t.name as name, t.username as username, t.created_at as created_at,
        t.password as password, t.deleted as deleted, t.role_id as role_id,
        r.name as role_name
        from teacher t
        join role r on t.role_id = r.id
        where t.id=$1
        `,
        [id],
      );
      if(userWithRoles.rows.length === 0) {
        return this.getById(id);
      }
      const permissinonResponse = await this.databaseService.runQuery(
        `
        select array_to_json(array(
          select permission
          from permission_based
          where role_id = $1
        )) as permissions
        `,
        [userWithRoles.rows[0].role_id],
      );
      const result = {
        ...userWithRoles.rows[0],
        permissions: permissinonResponse.rows[0].permissions,
      }
      return  new TeachersWithDetailsModel(result);
    } catch (error) {
      throw new Error(error);
    }
    
  }

  async create(teacher: RegisterDto) {
    const client = await this.databaseService.getPoolClient()
    try {
      await client.query('begin');
      const databaseResponse = await client.query(
        `
        insert into teacher(name, username, password)
        values($1, $2, $3)
        returning *;
        `,
        [teacher.name, teacher.username, teacher.password],
      );
      await client.query('commit');
      return new TeacherModel(databaseResponse.rows[0]);
    } catch (error) {
      await client.query('rollback');
      if(error.code === PostgresErrorCode.UniqueViolation) {
        throw new ConflictException('Username already exists');
      }
    } finally {
      client.release();
    }
    
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
