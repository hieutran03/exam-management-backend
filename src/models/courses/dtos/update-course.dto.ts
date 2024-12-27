import { IsString } from "class-validator";

export class UpdateCourseDTO {
  @IsString()
  name: string;
}