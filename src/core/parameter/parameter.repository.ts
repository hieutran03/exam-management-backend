import { Injectable } from "@nestjs/common";
import DatabaseService from "../database/database.service";

@Injectable()
export default class ParameterRepository{
  constructor(private readonly databaseService: DatabaseService) {
  }
  async getAll(){
    try {
      const databaseResponse = await this.databaseService.runQuery(`
        select * from parameter;
      `);
      return databaseResponse.rows;
    } catch (error) {
      throw error;
    }
  }

  async getById(id: number){
    try {
      const databaseResponse = await this.databaseService.runQuery(`
        select * from parameter
        where id = $1;
      `, [id]);
      return databaseResponse.rows[0];
    } catch (error) {
      throw error;
    }
  }

  async getByName(name: string){
    try {
      const databaseResponse = await this.databaseService.runQuery(`
        select * from parameter
        where name = $1;
      `, [name]);
      return databaseResponse.rows[0];
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, value: string){
    try {
      const databaseResponse = await this.databaseService.runQuery(`
        update parameter
        set value = $1
        where id = $2
        returning *;
      `, [value, id]);
      return databaseResponse.rows[0];
    } catch (error) {
      throw error;
    }
  }

  async updateByName(name: string, value: string){
    try {
      const databaseResponse = await this.databaseService.runQuery(`
        update parameter
        set value = $1
        where name = $2
        returning *;
      `, [value, name]);
      return databaseResponse.rows[0];
    } catch (error) {
      throw error;
    }
  }
}