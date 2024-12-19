import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return await knex.raw(`
    create table parameter(
      id int generated by default as identity primary key,
      name varchar(255) not null,
      value int
    );
    insert into parameter(name, value) values ('max_exam_question', 5);
    insert into parameter(name, value) values ('max_exam_time', 180);
    insert into parameter(name, value) values ('min_exam_time', 30);
    insert into parameter(name, value) values ('max_exam_score', 0);
    insert into parameter(name, value) values ('min_exam_score', 10);
  `)
}


export async function down(knex: Knex): Promise<void> {
  return await knex.raw(`
    drop table parameter;
  `);
}
