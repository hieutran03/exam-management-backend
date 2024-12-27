import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    alter table exam_result
    add column class_id varchar(200);
  
    alter table exam_result
    add constraint exam_result_course_class_id_fkey
    foreign key (class_id)
    references course_class(class_id);
  `)
}


export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    alter table exam_result
    drop constraint exam_result_course_class_id_fkey;
  
    alter table exam_result
    drop column course_class_id;
  `)
}

