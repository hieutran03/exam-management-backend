interface QuestionModelData {
  id: number;
  question: string;
  content: string;
  course_id: number;
  question_level_id: number;
}

export class QuestionModel {
  id: number;
  question: string;
  content: string;
  course_id: number;
  question_level_id: number;
  constructor(data: QuestionModelData) {
    this.id = data.id;
    this.question = data.question;
    this.content = data.content;
    this.course_id = data.course_id;
    this.question_level_id = data.question_level_id;
  }
}