import { Type } from "class-transformer";
import { IsArray, IsDate, IsNumber } from "class-validator";

export default class CreateExamDTO {
  @IsNumber()
  total_score: number;
  @IsNumber()
  time: number;
  @IsDate()
  @Type(() => Date)
  exam_date: Date;
  @IsNumber()
  course_id: number;
  @IsNumber()
  semester_school_year_id: number;
  @IsArray()
  question_ids: number[];
}