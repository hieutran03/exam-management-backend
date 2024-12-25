import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return await knex.raw(`
    create table report (
      semester_school_year_id int not null,
      teacher_id int not null,
      title varchar(255),
      total_of_exam int not null,
      total_of_exam_result int not null,
      foreign key (semester_school_year_id) references semester_school_year(id),
      foreign key (teacher_id) references teacher(id),
      primary key (semester_school_year_id, teacher_id)
    );`
  )
}


export async function down(knex: Knex): Promise<void> {
  return await knex.raw(`
    drop table report;
  `);
}

