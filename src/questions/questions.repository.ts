import { Injectable } from "@nestjs/common";
import DatabaseService from "src/core/database/database.service";
import { GetExamDto } from "src/models/exams/dtos/get-exam.dto";
import CreateQuestionDTO from "src/models/questions/dtos/create-question.dto";
import UpdateQuestionDTO from "src/models/questions/dtos/update-question.dto";

@Injectable()
export default class QuestionsRepository {
  constructor(private readonly databaseService: DatabaseService) {}
  // async findAllWithDetails() {
  //   const databaseResponse = await this.databaseService.runQuery(`
  //     select q.id, q.content, c.name as course_name, 
  //     ql.name as question_level_name, t.name as teacher_name
  //     from question q
  //     join course c on c.id = q.course_id
  //     join question_level ql on ql.id = q.question_level_id
  //     join teacher t on t.id = q.teacher_id
  //     where q.deleted = false
  //   `)
  //   return databaseResponse.rows;
  // }

  async findAllWithDetals(data: GetExamDto) {
    const databaseResponse = await this.databaseService.runQuery(`
      select q.id, q.content, c.name as course_name, 
      ql.name as question_level_name, t.name as teacher_name
      from question q
      join course c on c.id = q.course_id
      join question_level ql on ql.id = q.question_level_id
      join teacher t on t.id = q.teacher_id
      where 
        q.teacher_id =  cast(coalesce(nullif(cast($1 as text), ''), cast (q.teacher_id as text)) as integer)
        and q.course_id = cast(coalesce(nullif(cast($2 as text), ''), cast (q.course_id as text)) as integer)
        and q.deleted = false
    `, [data.teacher_id, data.course_id]);
    return databaseResponse.rows;
  }

  async findWithDetails(question_id: number) {
    const databaseResponse = await this.databaseService.runQuery(`
      select q.id, q.content, q.teacher_id, c.name as course_name, 
      ql.name as question_level_name, t.name as teacher_name
      from question q
      join course c on c.id = q.course_id
      join question_level ql on ql.id = q.question_level_id
      join teacher t on t.id = q.teacher_id
      where q.id = $1 and q.deleted = false
    `, [question_id]);
    return databaseResponse.rows[0];
  }
  async findById(id: number) {
    const databaseResponse = await this.databaseService.runQuery(`
      select * from question 
      where id = $1 and deleted = false
    `, [id]);
    return databaseResponse.rows[0];
  }

  async findByCourseId(course_id: number) {
    const databaseResponse = await this.databaseService.runQuery(`
      select * from question 
      where course_id = $1 and deleted = false
    `, [course_id]);
    return databaseResponse.rows;
  }

  async create(teacher_id: number ,questionData: CreateQuestionDTO) {
    const client = await this.databaseService.getPoolClient();
    try {
      await client.query('begin');
      const questionResponse = await client.query(`
        insert into question (content, course_id, question_level_id, teacher_id)
        values ($1, $2, $3, $4)
        returning *
      `, [questionData.content, questionData.course_id, questionData.question_level_id, teacher_id]);
      await client.query('commit');
      return questionResponse.rows[0];

    } catch (error) {
      await client.query('rollback');
      throw error;
    }
  }

  async update(id: number, questionData: UpdateQuestionDTO) {
    const client = await this.databaseService.getPoolClient();
    try {
      await client.query('begin');
      const questionResponse = await client.query(`
        update question
        set content = $1, course_id = $2, question_level_id = $3
        where id = $4
        returning *
      `, [questionData.content, questionData.course_id, questionData.question_level_id, id]);
      await client.query('commit');
      return questionResponse.rows[0];
    } catch (error) {
      await client.query('rollback');
      throw error;
    }
  }
  async delete(id: number) {
    const client = await this.databaseService.getPoolClient();
    try {
      await client.query('begin');
      const questionResponse = await client.query(`
        update question
        set deleted = true
        where id = $1
        returning *
      `, [id]);
      await client.query('commit');
      return questionResponse.rows[0];
    } catch (error) {
      await client.query('rollback');
      throw error;
    }

  } 
}