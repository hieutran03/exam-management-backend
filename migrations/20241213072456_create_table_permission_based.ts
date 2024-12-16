import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    create type permission_name as enum(
      'TEACHER_READ',
      'TEACHER_MODIFY',
      'QUESTION_READ',
      'QUESTION_MODIFY',
      'EXAM_READ',
      'EXAM_MODIFY',
      'GRADE_READ' ,
      'GRADE_MODIFY',
      'REPORT_READ'
    );
    create table permission_based(
      role_id int references role(id),
      permission permission_name,
      primary key(role_id, permission)
    );
  `);
}


export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    drop table permission_based;
    drop type permission_name;
  `)
}

