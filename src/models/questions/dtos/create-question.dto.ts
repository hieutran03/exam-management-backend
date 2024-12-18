import { IsNumber, IsString } from "class-validator";

export default class CreateQuestionDTO{
  @IsString()
  content: string;
  @IsNumber()
  course_id: number;
  @IsNumber()
  question_level_id: number;

}