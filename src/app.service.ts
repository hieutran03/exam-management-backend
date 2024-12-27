import { Injectable } from '@nestjs/common';
import DatabaseService from './core/database/database.service';

@Injectable()
export class AppService {
  constructor(private databaseService: DatabaseService){}
  getHello(): string {
    return 'Hello World!';
  }

  async getSemesters() {
    const databaseResponse = await this.databaseService.runQuery(`
      select * from semester_school_year
    `);
    return databaseResponse.rows;
  }

  // async getCourses() {
  //   const databaseResponse = await this.databaseService.runQuery(`
  //     select * from course
  //   `);
  //   return databaseResponse.rows;
  // }
}
