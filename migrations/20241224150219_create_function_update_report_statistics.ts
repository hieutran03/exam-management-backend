import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    create or replace function update_report_statistics()
    returns trigger as $$
    declare
        _course record;
        total_exams int := 0;
        total_exam_results int := 0;
    begin
        -- duyệt qua từng môn học liên quan đến kỳ học và giáo viên
        for _course in
            select id from course
        loop
            -- tính tổng số bài kiểm tra và kết quả bài kiểm tra cho từng môn học
            insert into report_detail(teacher_id, semester_school_year_id, course_id, number_of_exam, number_of_exam_result, percentage_of_exam, percentage_of_exam_result)
            select
                new.teacher_id, -- teacher_id
                new.semester_school_year_id, -- semester_school_year_id
                _course.id, -- course_id
                count(distinct exam.id), -- number_of_exam
                count(exam_result.student_id), -- number_of_exam_result
                0.0 as percentage_of_exam, -- placeholder, sẽ cập nhật sau
                0.0 as percentage_of_exam_result -- placeholder, sẽ cập nhật sau
            from exam
            left join exam_result on exam.id = exam_result.exam_id
            where exam.course_id = _course.id
              and exam.semester_school_year_id = new.semester_school_year_id
              and exam.teacher_id = new.teacher_id
            group by exam.course_id;

            -- cộng dồn vào tổng số bài kiểm tra và kết quả
            total_exams := total_exams + (select count(*) from exam where course_id = _course.id and semester_school_year_id = new.semester_school_year_id and teacher_id = new.teacher_id);
            total_exam_results := total_exam_results + (select count(*) from exam_result where exam_id in (select id from exam where course_id = _course.id and semester_school_year_id = new.semester_school_year_id and teacher_id = new.teacher_id));
        end loop;

        -- -- cập nhật phần trăm chính xác cho từng môn học
        update report_detail
        set percentage_of_exam = case 
          when total_exams = 0 then 0 
              else number_of_exam::float / total_exams * 100 
          end,
            percentage_of_exam_result = case 
          when total_exam_results = 0 then 0 
          else number_of_exam_result::float / total_exam_results * 100 
            end
        where teacher_id = new.teacher_id
          and semester_school_year_id = new.semester_school_year_id;

        -- cập nhật tổng số liệu thống kê vào bảng report
        update report
        set total_of_exam = total_exams,
            total_of_exam_result = total_exam_results
        where teacher_id = new.teacher_id
          and semester_school_year_id = new.semester_school_year_id;

        return new;
    end;
    $$ language plpgsql;
  `);
}


export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    drop function update_report_statistics;
  `);
}

