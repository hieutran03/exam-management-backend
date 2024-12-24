import { IsNumber, IsString } from "class-validator";

export class UpdateStudentResultDTO {
  @IsString()
  student_name: string;
  @IsNumber()
  score: number;
  @IsString()
  score_text: string;
  @IsString()
  note: string;
}
