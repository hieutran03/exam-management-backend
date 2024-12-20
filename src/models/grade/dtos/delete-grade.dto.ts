import { IsNumber } from "class-validator";

export class DeleteGradeDTO {
  @IsNumber()
  exam_id: number;
  @IsNumber()
  student_id: number;
}