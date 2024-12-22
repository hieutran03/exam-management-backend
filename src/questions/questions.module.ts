import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import QuestionsRepository from './questions.repository';
import MyQuestionsController from './myQuestions.controller';
import { QuestionLevelRepository } from './questionLevel.repository';
import { QuestionLevelService } from './questionLevel.service';
import { QuestionLevelController } from './questionLevel.controller';
import { VerifyQuestionIdInterceptor } from './verifyQuestionId.interceptor';

@Module({
  controllers: [QuestionsController, MyQuestionsController, QuestionLevelController],
  providers: [
    QuestionsService,
    QuestionsRepository,
    QuestionLevelService, 
    QuestionLevelRepository,
    VerifyQuestionIdInterceptor,
  ],
})
export class QuestionsModule {}
