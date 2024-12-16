import{ Request } from 'express';
import { TeacherModel } from 'src/models/teachers/teachers.model';
import { TeachersWithDetailsModel } from 'src/models/teachers/teachersWithDetails.model';
export interface RequestWithUser extends Request {
  user: TeacherModel;
}

export interface RequestWithUserDetails extends Request {
  user: TeachersWithDetailsModel;
}