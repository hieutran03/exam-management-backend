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

  async getAllCourseClass(courseId: number, options?: any){
    const databaseResponse = await this.databaseService.runQuery(`
      select cc.*, t.name as teacher_name, c.name as course_name,
      concat('học kỳ ', ssy.semester, ' năm học ', ssy.first_year, '-', ssy.second_year) as semester_school_year
      from course_class cc
      join teacher t on cc.teacher_id = t.id
      join semester_school_year ssy on cc.semester_school_year_id = ssy.id
      join course c on cc.course_id = c.id
      where course_id = $1
      and semester_school_year_id = cast(coalesce(nullif(cast($2 as text),''), cast(semester_school_year_id as text)) as integer) 
      and teacher_id = cast(coalesce(nullif(cast($3 as text),''), cast(teacher_id as text)) as integer)
    `, [courseId, options?.ssy_id, options?.teacher_id]);
    return databaseResponse.rows
    
  }

  // async getAllCourseClassWithOptions(courseId: number, options: any){
  //   const databaseResponse = await this.databaseService.runQuery(`
  //     select * from course_class
  //     where course_id = $1 
  //     and semester_school_year_id = cast(coalesce(nullif(cast($2 as text),''), cast(semester_school_year_id as text)) as integer) 
  //     and teacher_id = cast(coalesce(nullif(cast($3 as text),''), cast(teacher_id as text)) as integer)
  //   `,);
  //   return databaseResponse.rows;
  
  // }
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
        set class_id = $1, semester_school_year_id = $2, teacher_id = $3
        where course_id = $4 and class_id = $5 returning *
      `, [data.class_id, data.semester_school_year_id, data.teacher_id, course_id, class_id]);
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