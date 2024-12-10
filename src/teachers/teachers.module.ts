import { Module } from '@nestjs/common';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';
import { TeachersRepository } from './teachers.repository'
@Module({
  exports: [TeachersService],
  controllers: [TeachersController],
  providers: [TeachersService, TeachersRepository]
})
export class TeachersModule {}
