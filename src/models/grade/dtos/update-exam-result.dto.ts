import { IsNumber, IsString } from "class-validator";

export class UpdateExamResultDTO {
  @IsNumber()
  student_id: number;
  @IsString()
  student_name: string;
  @IsNumber()
  score: number;
  @IsString()
  score_text: string;
  @IsString()
  note: string;
}
