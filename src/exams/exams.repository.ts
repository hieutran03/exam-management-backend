import { BadRequestException, Injectable } from "@nestjs/common";
import { PoolClient } from "pg";
import DatabaseService from "src/core/database/database.service";
import PostgresErrorCode from "src/core/database/postgresErrorCode.enum";
import CreateExamDTO from "src/models/exams/dtos/create-exam.dto";
import { UpdateExamDTO } from "src/models/exams/dtos/update-exam.dto";
import getDifferenceBetweenArrays from "src/common/utils/getDifferentBetweenArrays.util";

@Injectable()
export default class ExamsRepository {
  constructor(private readonly databaseService: DatabaseService) {}
  async getAll(teacher_id?: number){
    try {
      const databaseResponse = await this.databaseService.runQuery(`
        select 
          e.id,
          e.total_score, 
          e.time, 
          e.exam_date, 
          c.name as course, 
          t.name as teacher,
          concat(
            'Đề thi ',
            c.name,
            ' Học kỳ ',
            ssy.semester, 
            ' Năm học ',
            ssy.first_year,
            ' - ',
            ssy.second_year
          )
          as title
        from 
          exam e
        join
          course c on e.course_id = c.id
        join
          semester_school_year ssy on e.semester_school_year_id = ssy.id
        join 
          teacher t on e.teacher_id = t.id
        where
          e.deleted = false and
          e.teacher_id = cast(coalesce(nullif(cast($1 as text),''), cast(e.teacher_id as text)) as integer)
        order by e.id asc;  
      `, [teacher_id]);
      return databaseResponse.rows;
    } catch (error) {
      throw error;
    }
  } 

  async getById(id: number){
    try {
      const databaseResponse = await this.databaseService.runQuery(`
        select * from exam
        where id = $1 and deleted = false;
      `, [id]);
      return databaseResponse.rows[0];
    } catch (error) {
      throw error;
    }
  }
  async getDetailsById(id: number){
    try {
      const examResponse = await this.databaseService.runQuery(`
        select 
          e.id,
          e.total_score, 
          e.time, 
          e.exam_date, 
          c.name as course, 
          t.name as teacher,
          concat(
            'Đề thi ',
            c.name,
            ' Học kỳ ',
            ssy.semester, 
            ' Năm học ',
            ssy.first_year,
            ' - ',
            ssy.second_year
          )
          as title
        from 
          exam e
        join
          course c on e.course_id = c.id
        join
          semester_school_year ssy on e.semester_school_year_id = ssy.id
        join 
          teacher t on e.teacher_id = t.id
        where
          e.deleted = false 
          and
          e.id = $1;
      `, [id]);
      if(examResponse.rowCount === 0){
        throw new BadRequestException(`Exam with id ${id} not found`);
      }
      const questions = await this.getQuestions(id);
      return {
        ...examResponse.rows[0],
        questions
      };
    } catch (error) {
      throw error;   
    }
  }

  getQuestions = async (exam_id: number) => {
    try {
      const databaseResponse = await this.databaseService.runQuery(`
        select q.id, q.content
        from question q
        join exam_question eq on q.id = eq.question_id
        where eq.exam_id = $1;
      `, [exam_id]);
      return databaseResponse.rows;
    } catch (error) {
      throw error;
    }
  }

  async create(teacher_id: number, data: CreateExamDTO){
    const client = await this.databaseService.getPoolClient();
    try {
      await client.query('begin');
      const examResponse = await client.query(`
        insert into exam(total_score, time, exam_date, course_id, semester_school_year_id, teacher_id)
        values($1, $2, $3, $4, $5, $6)
        returning *;
      `, [
          data.total_score,
          data.time,
          data.exam_date,
          data.course_id,
          data.semester_school_year_id, 
          teacher_id
        ]);
        const exam = examResponse.rows[0];
        const questionIdsResponse = await this.insertQuestion(client, exam.id, data.question_ids)
        await client.query('commit');
        return {
          ...exam,
          question_ids: questionIdsResponse.map((row: any) => row.question_id)
        };
      } catch (error) {
        await client.query('rollback');
        if(PostgresErrorCode.ForeignKeyViolation === error.code){
          throw new BadRequestException('question_id or course_id or semester_school_year_id not found');
        }
        throw new error;
      } finally {
        client.release();
      }
  }

  async update(id: number, data: UpdateExamDTO){
    const client = await this.databaseService.getPoolClient();
    try {
      await client.query('begin');
      const examResponse = await client.query(`
        update exam
        set total_score = $1,
        time = $2,
        exam_date = $3,
        course_id = $4,
        semester_school_year_id = $5
        where id = $6
        returning *;
      `, [
        data.total_score,
        data.time,
        data.exam_date,
        data.course_id,
        data.semester_school_year_id,
        id
      ]);
      const exam = examResponse.rows[0];
      if(!exam){
        throw new Error(`Exam with id ${id} not found`);
      }
      await this.updateQuestions(client, id, data.question_ids).catch((error) => {
        throw error;
      });
      await client.query('commit');
      return exam;
    } catch (error) {
      await client.query('rollback');
      throw error;
    } finally {
      client.release();
    }
  }

  async updateQuestions(client: PoolClient, exam_id: number, question_ids: number[]){
    const currentQuestions = await client.query(`
      select question_id from exam_question
      where exam_id = $1
    `, [exam_id]);
    const currentQuestionIds = currentQuestions.rows.map((row: any) => row.question_id);
    
    const questionsToInsert = getDifferenceBetweenArrays(question_ids, currentQuestionIds);
    const questionsToDelete = getDifferenceBetweenArrays(currentQuestionIds, question_ids);

    await this.insertQuestion(client, exam_id, questionsToInsert).catch((error) => {
      throw error;
    });
    await this.removeQuestion(client, exam_id, questionsToDelete).catch((error) => {
      throw error;
    });

  }
  async insertQuestion(client: PoolClient,exam_id: number, question_ids: number[]){
    if(question_ids.length === 0){
      return;
    }
    const insertQuestion = await client.query(`
        insert into exam_question(exam_id, question_id)
        select $1 as exam_id, unnest($2::int[]) as question_id
        returning *;
      `, 
        [exam_id, question_ids]
    );
    return insertQuestion.rows;
  }

  async removeQuestion(client: PoolClient, exam_id: number, question_ids: number[]){
    if(question_ids.length === 0){
      return; 
    }

    const removeQuestion = await client.query(`
      delete from exam_question
      where exam_id = $1
      and question_id = any($2::int[]);
    `, 
      [exam_id, question_ids]
    );
    return removeQuestion.rows;
  }
  async delete(id: number){
    const client = await this.databaseService.getPoolClient();
    try {
      await client.query('begin');
      const examResponse = await client.query(`
        update exam
        set deleted = true
        where id = $1
        returning *;
      `, [id]);
      const exam = examResponse.rows[0];
      if(!exam){
        throw new BadRequestException(`Exam with id ${id} not found`);
      }
      await client.query('commit');
      return exam;
    } catch (error) {
      await client.query('rollback');
      throw error;
    } finally {
      client.release();
    }   
  }
}