import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return await knex.raw(`
    create or replace procedure insert_into_report(
        p_semester_school_year_id int,
        p_teacher_id int,
        p_total_of_exam int,
        p_total_of_exam_result int
    )
    language plpgsql
    as $$
    begin
        -- Xóa bản ghi nếu tồn tại
        delete
        from report_detail
        where semester_school_year_id = p_semester_school_year_id
          and teacher_id = p_teacher_id;
        delete 
        from report
        where semester_school_year_id = p_semester_school_year_id
          and teacher_id = p_teacher_id;
        -- Chèn lại bản ghi mới
        insert into report(
        semester_school_year_id, 
        teacher_id, 
        total_of_exam, 
        total_of_exam_result
        )
        values (
        p_semester_school_year_id, 
        p_teacher_id, 
        p_total_of_exam, 
        p_total_of_exam_result
        );

        -- Thông báo hoàn thành
        raise notice 'Record dropped and re-inserted for teacher_id=% and semester_school_year_id=%', p_teacher_id, p_semester_school_year_id;
    end;
    $$;
  `);
}


export async function down(knex: Knex): Promise<void> {
  return await knex.raw(`
    drop procedure insert_into_report
  `)
}

