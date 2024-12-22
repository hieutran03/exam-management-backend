import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return await knex.raw(`
    create table exam_result(
      exam_id int not null,
      student_id int not null,
      student_name varchar(255) not null,
      score int not null,
      score_text varchar(255) not null,
      note text,
      primary key(exam_id, student_id),
      foreign key(exam_id) references exam(id) 
    )
  `)
}


export async function down(knex: Knex): Promise<void> {
  return await knex.raw(`
    drop table exam_result
  `)
}

