import DatabaseService from "src/core/database/database.service";

export default class QuestionsRepository {
  constructor(private readonly databaseService: DatabaseService) {}
  findAll() {
    return this.databaseService.runQuery(`
      select * from questions  
    `)
  }
}