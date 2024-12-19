import { Module } from '@nestjs/common';
import { ParameterService } from './parameter.service';
import { ParameterController } from './parameter.controller';
import ParameterRepository from './parameter.repository';

@Module({
  providers: [ParameterService, ParameterRepository],
  controllers: [ParameterController],
  exports: [ParameterService],
})
export class ParameterModule {}
