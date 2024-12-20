import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateTeacherDTO {
  @IsOptional()
  @IsString()
  name: string;
  @IsOptional()
  @IsNumber()
  role_id: number;
}