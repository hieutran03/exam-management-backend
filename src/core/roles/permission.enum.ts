import { ConfigService } from "@nestjs/config";
import {config} from 'dotenv'

config();
const configService = new ConfigService();

enum PermissionEnum {
  TEACHER_READ = configService.get('TEACHER_READ'),
  TEACHER_MODIFY = configService.get('TEACHER_MODIFY'),
  QUESTION_READ = configService.get('QUESTION_READ'),
  QUESTION_MODIFY = configService.get('QUESTION_MODIFY'),
  EXAM_READ = configService.get('EXAM_READ'),
  EXAM_MODIFY = configService.get('EXAM_MODIFY'),
  GRADE_READ = configService.get('GRADE_READ'),
  GRADE_MODIFY = configService.get('GRADE_MODIFY'),
  REPORT_READ = configService.get('REPORT_READ'),
}
// enum PermissionEnum {
//     TEACHER_READ,
//     TEACHER_MODIFY,
//     QUESTION_READ,
//     QUESTION_MODIFY,
//     EXAM_READ,
//     EXAM_MODIFY,
//     GRADE_READ ,
//     GRADE_MODIFY,
//     REPORT_READ,
//   }
export default PermissionEnum;

