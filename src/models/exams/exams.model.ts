interface ExamsModelData {
  id: number;
  exam_date: Date;
  time: number;
  totalScore: number;
  course_id: number;
  teacher_id: number;
  semester_school_year_id: number;
}
export default class ExamsModel {
  constructor(private data: ExamsModelData) {
    this.id = data.id;
    this.exam_date = data.exam_date;
    this.time = data.time;
    this.totalScore = data.totalScore;
    this.course_id = data.course_id;
    this.teacher_id = data.teacher_id;
    this.semester_school_year_id = data.semester_school_year_id;
  }
  id: number;
  exam_date: Date;
  time: number;
  totalScore: number;
  course_id: number;
  teacher_id: number;
  semester_school_year_id: number;
}