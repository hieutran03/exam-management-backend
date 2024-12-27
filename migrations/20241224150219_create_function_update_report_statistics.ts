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
        select id, name from course
      loop
        -- tính tổng số bài kiểm tra và kết quả bài kiểm tra cho từng môn học
        insert into report_detail(
          teacher_id, 
          semester_school_year_id, 
          course_id, number_of_exam, 
          number_of_exam_result, 
          percentage_of_exam, 
          percentage_of_exam_result, 
          title
        )
        select
          new.teacher_id, -- teacher_id
          new.semester_school_year_id, -- semester_school_year_id
          _course.id, -- course_id
          count(distinct exam.id), -- number_of_exam
          count(exam_result.student_id), -- number_of_exam_result
          0.0 as percentage_of_exam, -- placeholder, sẽ cập nhật sau
          0.0 as percentage_of_exam_result, -- placeholder, sẽ cập nhật sau
          concat( 	--------------- title
            'Báo cáo thống kê số lượng đề và bài chấm môn ',
            _course.name,
            ' Học kỳ',
            semester_school_year.semester,
            ' Năm học ',
            semester_school_year.first_year,
            '-',
            semester_school_year.second_year
          )
        from exam
        left join exam_result on exam.id = exam_result.exam_id
        join semester_school_year on exam.semester_school_year_id = semester_school_year.id
        where exam.course_id = _course.id
          and exam.semester_school_year_id = new.semester_school_year_id
          and exam.teacher_id = new.teacher_id
        group by exam.course_id, 
          _course.name, 
          semester_school_year.semester, 
          semester_school_year.first_year, 
          semester_school_year.second_year;

        -- cộng dồn vào tổng số bài kiểm tra và kết quả
        total_exams := total_exams + (select count(*) from exam where course_id = _course.id and semester_school_year_id = new.semester_school_year_id and teacher_id = new.teacher_id);
        total_exam_results := total_exam_results + (select count(*) from exam_result where exam_id in (select id from exam where course_id = _course.id and semester_school_year_id = new.semester_school_year_id and teacher_id = new.teacher_id));
      end loop;

      -- -- cập nhật phần trăm chính xác cho từng môn học
      update report_detail
      set 
        percentage_of_exam = 
          case 
            when total_exams = 0 then 0 
              else number_of_exam::float / total_exams * 100 
            end,
        percentage_of_exam_result = 
          case 
            when total_exam_results = 0 then 0 
            else number_of_exam_result::float / total_exam_results * 100 
          end
      where teacher_id = new.teacher_id
        and semester_school_year_id = new.semester_school_year_id;

      -- cập nhật tổng số liệu thống kê vào bảng report
      update report
      set 
        total_of_exam = total_exams,
        total_of_exam_result = total_exam_results,
        title = concat(
          'Báo cáo thống kê số lượng đề và bài chấm Học kỳ ',
          ssy.semester,
          ' Năm học ',
          ssy.first_year,
          '-',
          ssy.second_year
        )
      from semester_school_year ssy
      where report.semester_school_year_id = ssy.id
        and report.teacher_id = new.teacher_id
        and report.semester_school_year_id = new.semester_school_year_id;

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

