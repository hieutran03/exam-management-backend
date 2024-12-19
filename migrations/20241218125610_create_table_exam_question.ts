import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return await knex.raw(`
    create table exam_question(
      question_id int not null,
      exam_id int not null,
      primary key(question_id, exam_id),
      foreign key(question_id) references question(id),
      foreign key(exam_id) references exam(id)
    );
  `)
}


export async function down(knex: Knex): Promise<void> {
  return await knex.raw(`
    drop table exam_question;
  `);
}

