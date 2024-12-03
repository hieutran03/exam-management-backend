import { Expose } from "class-transformer";

export class TeacherModel {
  id: number;
  @Expose()
  name: string;
  @Expose()
  username: string;
  password: string;
}
 
