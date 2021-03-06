import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UndefinedToNullInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    //여기는 컨트롤러 실행 전

    //리턴후 컨트롤러 실행 후
    return next
      .handle()
      .pipe(map((data) => (data === undefined ? null : data)));
  }
}
