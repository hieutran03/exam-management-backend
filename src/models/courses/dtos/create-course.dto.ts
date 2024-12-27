import { IsString } from "class-validator";

export class CreateCourseDTO {
  @IsString()
  name: string;
}