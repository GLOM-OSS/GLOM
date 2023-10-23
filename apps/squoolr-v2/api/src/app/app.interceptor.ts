import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { encrypt } from '@glom/encrypter';
import { Request } from 'express';

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
