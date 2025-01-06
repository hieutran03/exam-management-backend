import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';
 
export async function seed(knex: Knex): Promise<void> {
  const hashedPassword = await bcrypt.hash('12345', 10);
  await knex.raw(
    `
      insert into role(name) values('super_admin');
      insert into permission_based(role_id, permission) values(1, 'TEACHER_READ');
      insert into permission_based(role_id, permission) values(1, 'TEACHER_MODIFY');
      insert into permission_based(role_id, permission) values(1, 'QUESTION_READ');
      insert into permission_based(role_id, permission) values(1, 'QUESTION_MODIFY');
      insert into permission_based(role_id, permission) values(1, 'EXAM_READ');
      insert into permission_based(role_id, permission) values(1, 'EXAM_MODIFY');
      insert into permission_based(role_id, permission) values(1, 'GRADE_READ');
      insert into permission_based(role_id, permission) values(1, 'GRADE_MODIFY');
      insert into permission_based(role_id, permission) values(1, 'REPORT_READ');
    `);
  return await knex.raw(
    `
      insert into teacher(name, username, password, role_id) values('ADMIN', 'admin', ?, 1);
    `,
    [hashedPassword],
  );
}