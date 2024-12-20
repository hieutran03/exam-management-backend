interface GradeModelData{
  exam_id: number;
  student_id: number;
  student_name: string;
  score: number;
  score_text: string;
  note: string;
}

export class GradeModel{
  constructor(private readonly data: GradeModelData){
    this.exam_id = data.exam_id;
    this.student_id = data.student_id;
    this.student_name = data.student_name;
    this.score = data.score;
    this.score_text = data.score_text;
    this.note = data.note;
  }
  exam_id: number;
  student_id: number;
  student_name: string;
  score: number;
  score_text: string;
  note: string;
}