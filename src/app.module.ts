import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeachersModule } from './teachers/teachers.module';
import { QuestionsModule } from './questions/questions.module';
import * as Joi from 'Joi';
import { APP_PIPE } from '@nestjs/core';
import { ExamsModule } from './exams/exams.module';
import { ReportModule } from './report/report.module';
import { CoursesModule } from './courses/courses.module';
import CoreModule from './core/core.module';

@Module({
  imports: [
    TeachersModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    QuestionsModule,
    CoreModule,
    ExamsModule,
    ReportModule,
    CoursesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true
      })
    }
  ],
})
export class AppModule {}
