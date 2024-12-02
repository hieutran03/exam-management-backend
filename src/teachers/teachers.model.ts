import { Expose } from "class-transformer";

export class TeacherModel {
  id: number;
  @Expose()
  name: string;
  username: string;
  password: string;
}
 
