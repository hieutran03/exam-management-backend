import { Injectable } from "@nestjs/common";
import { VerifyIdInterceptor } from "src/common/interceptors/verifyId.interceptor";
import { QuestionsService } from "./questions.service";

@Injectable()
export class VerifyQuestionIdInterceptor extends VerifyIdInterceptor {
  constructor(private readonly questionService: QuestionsService) {
    super();
  }
  getById(id: number): Promise<any> {
    return this.questionService.getById(id);
  }
}