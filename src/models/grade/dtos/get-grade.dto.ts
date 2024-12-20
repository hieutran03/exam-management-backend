import { IsNumber, IsOptional } from "class-validator";

export class GetGradeDTO{
  @IsOptional()
  @IsNumber()
  exam_id: number;
  @IsOptional()
  @IsNumber()
  student_id: number;
}