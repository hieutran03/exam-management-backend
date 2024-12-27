import { BadRequestException, Injectable } from "@nestjs/common";
import DatabaseService from "src/core/database/database.service";
import { CreateCourseDTO } from "src/models/courses/dtos/create-course.dto";
import { UpdateCourseDTO } from "src/models/courses/dtos/update-course.dto";

@Injectable()
export class CoursesRepository{
  constructor(private databaseService: DatabaseService){}
  
  async getAll() {
    const databaseResponse = await this.databaseService.runQuery(`
      select * from course
    `);
    return databaseResponse.rows;
  }

  async getById(id: number) {
    const databaseResponse = await this.databaseService.runQuery(`
      select * from course where id = $1
    `, [id]);
    return databaseResponse.rows[0];
  }

  async create(course: CreateCourseDTO) {
    const client = await this.databaseService.getPoolClient();
    try {
      await client.query("begin");
      const databaseResponse = await client.query(`
        insert into course(name) values($1) returning *
      `, [course.name]);
      await client.query("commit");
      return databaseResponse.rows[0]; 
    } catch (error) {
      await client.query("rollback");
      throw new BadRequestException(error.message);
    } finally {
      client.release();
    }
  }

  async update(id: number, course: UpdateCourseDTO) {
    const client = await this.databaseService.getPoolClient();
    try {
      await client.query("begin");
      const databaseResponse = await client.query(`
        update course set name = $1 where id = $2 returning *
      `, [course.name, id]);
      await client.query("commit");
      return databaseResponse.rows[0];
    } catch (error) {
      await client.query("rollback");
      throw new BadRequestException(error.message);
    } finally {
      client.release();
    }   
  }

  async getAllCourseClass(courseId: number){
    const databaseResponse = await this.databaseService.runQuery(`
      select * from course_class where course_id = $1
    `, [courseId]);
    return databaseResponse.rows
    
  }
  async createCourseClass(course_id, data: any){
    const client = await this.databaseService.getPoolClient();
    try {
      await client.query("begin");
      const databaseResponse = await client.query(`
        insert into course_class(course_id, class_id, semester_school_year_id, teacher_id) 
        values($1, $2, $3, $4) returning *
      `, [course_id, data.class_id, data.semester_school_year_id, data.teacher_id],);
      await client.query("commit");
      return databaseResponse.rows[0];
    } catch (error) {
      await client.query("rollback");
      throw new BadRequestException(error.message);
    } finally { 
      client.release();
    }
  }

  async updateCourseClass(course_id: number, class_id: number, data: any){
    const client = await this.databaseService.getPoolClient();
    try {
      await client.query("begin");
      const databaseResponse = await client.query(`
        update course_class 
        set course_id = $1, class_id = $2, semester_school_year_id = $3, teacher_id = $4
        where course_id = $5 and class_id = $6 returning *
      `, [course_id, class_id, data.semester_school_year_id, data.teacher_id, course_id, class_id]);
      await client.query("commit");
      return databaseResponse.rows[0];
    } catch (error) {
      await client.query("rollback");
      throw new BadRequestException(error.message);
    } finally {
      client.release();
    }
  }

  async deleteCourseClass(course_id: number, class_id: number){
    const client = await this.databaseService.getPoolClient();
    try {
      await client.query("begin");
      const databaseResponse = await client.query(`
        delete from course_class where course_id = $1 and class_id = $2 returning *
      `, [course_id, class_id]);
      await client.query("commit");
      return databaseResponse.rows[0];
    } catch (error) {
      await client.query("rollback");
      throw new BadRequestException(error.message);
    } finally {
      client.release();
    }
  }
}