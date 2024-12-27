import { IsNumber, IsString } from "class-validator";

export class UpdateStudentResultDTO {
  @IsString()
  student_name: string;
  @IsNumber()
  student_id: number;
  @IsString()
  class_id: string;
  @IsNumber()
  score: number;
  @IsString()
  score_text: string;
  @IsString()
  note: string;
}
