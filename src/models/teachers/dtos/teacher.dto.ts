import { Exclude } from "class-transformer";

export class TeacherDTO{
  @Exclude()
  password: string;
  @Exclude()
  created_at: string;
  @Exclude()
  deleted: boolean;
}