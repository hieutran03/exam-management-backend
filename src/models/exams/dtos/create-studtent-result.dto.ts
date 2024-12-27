import { IsNumber, IsString } from "class-validator";

export class CreateStudentResultDTO {
  @IsNumber()
  student_id: number;
  @IsString()
  student_name: string;
  @IsString()
  class_id: string;
  @IsNumber()
  score: number;
  @IsString()
  score_text: string;
  @IsString()
  note: string;
}
