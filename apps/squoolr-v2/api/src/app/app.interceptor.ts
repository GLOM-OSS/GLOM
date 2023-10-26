import { encrypt } from '@glom/encrypter';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, map } from 'rxjs';

@Injectable()
export class AppInterceptor<T> implements NestInterceptor<T, string> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<string> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    Logger.log(request.url, request.method);
    return next.handle().pipe(
      map((data) => {
        if (
          typeof data === 'object' &&
          !request.headers['user-agent'].includes('PostmanRuntime')
        )
          data = encrypt(data);
        return data;
      })
    );
  }
}
