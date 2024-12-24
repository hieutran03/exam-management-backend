import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    create trigger trigger_update_report_statistics
    after insert on report
    for each row
    execute function update_report_statistics();
  `);
}


export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    drop trigger trigger_update_report_statistics on report;
  `);
}

