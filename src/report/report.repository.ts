import { Injectable } from "@nestjs/common";
import DatabaseService from "src/core/database/database.service";

@Injectable()
export class ReportRepository {
  constructor(private readonly databaseService: DatabaseService) {}
  
  async getAll() {
    try {
      const databaseResponse = await this.databaseService.runQuery(`
          select
            r.title as title,
            r.total_of_exam as total_of_exam,
            r.total_of_exam_result as total_of_exam_result,
            t.name as teacher_name
          from report r
          join teacher t on r.teacher_id = t.id
          order by r.title
        `);
      return databaseResponse.rows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAllByTeacher(teacher_id: number) {
    try {
      const databaseResponse = await this.databaseService.runQuery(`
        select * from report
        where teacher_id = cast(coalesce(nullif(cast($1 as text), ''), cast (teacher_id as text)) as number)
        order by title
      `, [teacher_id]);
      return databaseResponse.rows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getBySemesterSchoolYearId(semester_school_year_id: number) {
    try {
      const databaseResponse = await this.databaseService.runQuery(`
        select * from report
        where semester_school_year_id = $1
      `, [semester_school_year_id]);
      return databaseResponse.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  async getDetailsBySemesterSchoolYearId(semester_school_year_id: number, teacher_id: number) {
    try {
      const databaseResponse = await this.databaseService.runQuery(
        `
          select * from report
          where 
            semester_school_year_id = $1 
            and teacher_id = $2
        `, [semester_school_year_id, teacher_id]
      )
      const report = databaseResponse.rows[0];
      const reportDetailsReponse = await this.databaseService.runQuery(
        `
          select * from report_detail
          where 
            semester_school_year_id = $1 
            and teacher_id = $2
        `, [semester_school_year_id, teacher_id]
      )
      report.details = reportDetailsReponse.rows;
      return report;
    } catch (error) {
      throw error;
    }
  }

  async create(ssy_id: number, teacher_id: number) {
    const client = await this.databaseService.getPoolClient();
    try {
      client.query('BEGIN');
      const reportResponse = await client.query(
        `
          call insert_into_report($1, $2, 0, 0)
        `, [ssy_id, teacher_id]
      );
      return reportResponse.rows[0];
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

}