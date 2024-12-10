import { Knex } from 'knex';
 
export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    create table teacher (
      id int generated by default as identity primary key,
      name varchar(50) not null,
      username varchar(50) unique not null,
      password varchar(100) not null,
      created_at timestamp not null default current_timestamp,
      deleted boolean not null default 'false'
    );
  `);
}
 
export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    drop table teacher
  `);
}