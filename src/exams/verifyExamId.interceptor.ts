import { VerifyIdInterceptor } from "src/common/interceptors/verifyId.interceptor";
import { ExamsService } from "./exams.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class VerifyExamIdInterceptor extends VerifyIdInterceptor {
  constructor(private readonly examsService: ExamsService) {
    super();
  }
  async getById(id: number): Promise<any> {
    return await this.examsService.getById(id).catch((error) => {
      throw error;
    })
  }
};