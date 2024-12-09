import{ Request } from 'express';
import { TeacherModel } from 'src/models/teachers/teachers.model';
export interface RequestWithUser extends Request {
  user: TeacherModel;
}