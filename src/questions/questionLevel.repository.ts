import { Injectable } from "@nestjs/common";
import DatabaseService from "../../src/core/database/database.service";

@Injectable()
export class QuestionLevelRepository{
  constructor(private readonly databaseService: DatabaseService){}
  async findAll(){
    const databaseResponse = await this.databaseService.runQuery(`
      select * from question_level
      where deleted = false
    `)
    return databaseResponse.rows;
  }

  async findById(id: number){
    const databaseResponse = await this.databaseService.runQuery(`
      select * from question_level
      where id = $1 and deleted = false
    `, [id]);
    return databaseResponse.rows[0];
  }

  async create(name: string){
    const client = await this.databaseService.getPoolClient();
    try {
      await client.query('begin');
      const questionLevelResponse = await client.query(`
        insert into question_level (name)
        values ($1)
        returning id
      `, [name]);
      await client.query('commit');
      return questionLevelResponse.rows[0];
    } catch (error) {
      await client.query('rollback');
      throw error;
    } finally {
      client.release();
    }
  }

  async update(id: number, name: string){
    const client = await this.databaseService.getPoolClient();
    try {
      await client.query('begin');
      const questionLevelResponse = await client.query(`
        update question_level
        set name = $2
        where id = $1
        returning id
      `, [id, name]);
      await client.query('commit');
      return questionLevelResponse.rows[0];
    } catch (error) {
      await client.query('rollback');
      throw error;
    } finally {
      client.release();
    }
  }

  async delete(id: number){
    const client = await this.databaseService.getPoolClient();
    try {
      await client.query('begin');
      const questionLevelResponse = await client.query(`
        update question_level
        set deleted = true
        where id = $1
        returning id
      `, [id]);
      await client.query('commit');
      return questionLevelResponse.rows[0];
    } catch (error) {
      await client.query('rollback');
      throw error;
    } finally {
      client.release();
    }
  }
}