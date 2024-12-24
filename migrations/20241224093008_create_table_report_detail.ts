import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return await knex.raw(`
    create table report_detail(
      teacher_id int not null,
      semester_school_year_id int not null,
      course_id int not null,
      number_of_exam int not null,
      number_of_exam_result int not null,
      percentage_of_exam float not null,
      percentage_of_exam_result float not null,
      foreign key (teacher_id, semester_school_year_id) references report(teacher_id, semester_school_year_id),
      foreign key (course_id) references course(id),
      primary key (teacher_id, semester_school_year_id, course_id)
    )
  `)
}


export async function down(knex: Knex): Promise<void> {
  return await knex.raw(`
    drop table report_detail;
  `);
}

