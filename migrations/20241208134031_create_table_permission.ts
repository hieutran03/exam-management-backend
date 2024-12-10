import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    create table permission(
      id int generated by default as identity primary key,
      name varchar(50) not null,
    )
  
  `);
}


export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    drop table permission;  
  `)
}
