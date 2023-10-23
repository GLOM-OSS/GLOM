import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GlomExceptionResponse } from './glom-exceptions.dto';

@Catch(HttpException)
export class GlomExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let status = 500;
    let error = {
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Request could not be completed!!!',
    };
    status = exception.getStatus();
    error = exception.getResponse() as typeof error;
    Logger[status === 500 ? 'error' : 'debug'](
      `Called {${request.url}, ${request.method}}`,
      error.error
    );

    response.status(status).json(
      new GlomExceptionResponse({
        path: request.url,
        error: error.error,
        timestamp: Date.now(),
        message: error.message,
      })
    );
  }
}
