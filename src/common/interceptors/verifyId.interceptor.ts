import { CallHandler, ExecutionContext, HttpException, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { IGetByIdMethod } from "../interface/getByIdMethod.interface";


export class VerifyIdInterceptor implements NestInterceptor, IGetByIdMethod{
  constructor(){}
  async getById(id: number): Promise<any> {
  }
  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const dataReponse = await this.getById(request.params.id);
    if(user.id !== dataReponse.teacher_id){
      throw new HttpException('Unauthorized', 401);
    }
    return next.handle();
  }
}