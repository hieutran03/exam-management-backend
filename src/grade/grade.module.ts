import { Module } from '@nestjs/common';
import { GradeController } from './grade.controller';
import { GradeService } from './grade.service';
import { GradeRepository } from './grade.repository';

@Module({
  controllers: [GradeController],
  providers: [GradeService, GradeRepository],
})
export class GradeModule {}
