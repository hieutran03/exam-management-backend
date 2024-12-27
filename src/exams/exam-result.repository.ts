import { BadRequestException, Injectable } from "@nestjs/common";
import { PoolClient } from "pg";
import DatabaseService from "../../src/core/database/database.service";
import PostgresErrorCode from "../../src/core/database/postgresErrorCode.enum";
import { CreateExamResultDTO } from "../../src/models/exams/dtos/create-exam-result.dto";
import { CreateStudentResultDTO } from "../../src/models/exams/dtos/create-studtent-result.dto";
import { UpdateExamResultDTO } from "../../src/models/exams/dtos/update-exam-result.dto";
import { UpdateStudentResultDTO } from "../../src/models/exams/dtos/update-student-result.dto";

@Injectable()
export class ExamResultRepository{
  constructor(private readonly databaseService: DatabaseService){}
  
  async findAllByExamId(exam_id: number){
    try {
      const databaseResponse = await this.databaseService.runQuery(`
        select * 
        from exam_result
        where exam_id = $1
        order by student_id asc;
        `, [exam_id]);
      return databaseResponse.rows;
    } catch (error) {
      throw error;
    }
  }

  async findAllByStudentId(student_id: number){
    try {
      const databaseResponse = await this.databaseService.runQuery(`
        select * from exam_result
        where student_id = $1
        order by exam_id asc;
        `, [student_id]);
      return databaseResponse.rows;
    } catch (error) {
      throw error;
    }
  }


  async findByStudentIdAndExamId(exam_id: number, student_id: number){
    try {
      const databaseResponse = await this.databaseService.runQuery(`
        select * from exam_result
        where 
          exam_id = $1  
          and student_id = $2;
        `, [exam_id, student_id]);
      return databaseResponse.rows[0];
    } catch (error) {
      throw error;
    }
  }
  
  async create(exam_id: number, student_id: number ,data: CreateStudentResultDTO, client: PoolClient){
    try {
      const databaseResponse = await client.query(`
        insert into exam_result(exam_id, student_id, student_name, score, score_text, note)
        values($1, $2, $3, $4, $5, $6) returning *;
        `, [exam_id, student_id, data.student_name, data.score, data.score_text, data.note]);
      return databaseResponse.rows[0];
    } catch (error) {
      throw error;
    }
  }
 
  async createMany(exam_id: number, data: CreateExamResultDTO[]){
    const client = await this.databaseService.getPoolClient();
    try {
      await client.query('begin');
      await Promise.all(
        data.map((item) => 
          this.create(exam_id, item.student_id, item, client)
        )
      );
      await client.query('commit');
    } catch (error) {
      await client.query('rollback');
      if(error.code === PostgresErrorCode.UniqueViolation){
        throw new BadRequestException('Create failed');
      }
      throw error;
    }
  }

  async update(exam_id: number, student_id: number, data: UpdateStudentResultDTO, client: PoolClient){
    try {
      const databaseResponse = await client.query(`
        update exam_result set
        student_name = $1, score = $2, score_text = $3, note = $4
        where exam_id = $5 and student_id = $6 returning *;
      `, [data.student_name, data.score, data.score_text, data.note, exam_id, student_id]
      );
      return databaseResponse.rows[0];
    } catch (error) {
      throw error;
    }
  }

  async updateMany(exam_id: number,data: UpdateExamResultDTO[]){
    const client = await this.databaseService.getPoolClient();
    try {
      await client.query('begin');
      await Promise.all(
        data.map((item) => 
          this.update(exam_id, item.student_id, item, client)
        )
      );
      await client.query('commit');
    } catch (error) {
      await client.query('rollback');
      if(error.code === PostgresErrorCode.UniqueViolation){
        throw new BadRequestException('Duplicate student_id');
      }
      throw error;
    }
  }
  async deleteByExamIdAndStudentId(exam_id: number, student_id: number){
    const client = await this.databaseService.getPoolClient();
    try {
      await client.query('begin');
      const databaseResponse = await client.query(`
        delete from exam_result where exam_id = $1 and student_id = $2 returning *;
      `, [exam_id, student_id]);
      await client.query('commit');
      return databaseResponse.rows[0];
    } catch (error) {
      await client.query('rollback');
      throw error;
    }
  }
}