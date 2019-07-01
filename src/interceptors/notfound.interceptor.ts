import { Injectable, NestInterceptor, ExecutionContext, BadGatewayException, CallHandler, NotFoundException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(map(data => {
        if (data === undefined) throw new NotFoundException();
        return data;
      }));
  }
}