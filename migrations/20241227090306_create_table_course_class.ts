import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return await knex.raw(`
    create table course_class(
      class_id varchar(200) not null primary key,
      course_id int not null,
      semester_school_year_id int not null,
      teacher_id int not null,
      deleted boolean default false,
      foreign key (course_id) references course(id),
      foreign key (teacher_id) references teacher(id),
      foreign key (semester_school_year_id) references semester_school_year(id)
    );
  `);
}


export async function down(knex: Knex): Promise<void> {
  return await knex.raw(`
    drop table course_class;
  `);
}

