import { Module } from '@nestjs/common';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';
import ExamsRepository from './exams.repository';
import { MyExamController } from './my-exams.controller';
import { VerifyExamIdInterceptor } from './verifyExamId.interceptor';

@Module({
  controllers: [ExamsController, MyExamController],
  providers: [
    ExamsService, 
    ExamsRepository,
    VerifyExamIdInterceptor,
  ]
})
export class ExamsModule {}
