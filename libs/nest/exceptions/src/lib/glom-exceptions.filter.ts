import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GlomExceptionResponse } from './glom-exceptions.dto';
import { AxiosError } from 'axios';
import { error } from 'console';

@Catch(HttpException, AxiosError)
export class GlomExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException | AxiosError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let status = 500;
    let error = {
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Request could not be completed!!!',
    };
    if (exception instanceof AxiosError) {
      console.log(exception.response.data);
      const errorObj = exception.toJSON();
      status = errorObj['status'];
      error = {
        error: errorObj['code'],
        message: errorObj['message'],
      };
    } else {
      status = exception.getStatus();
      error = exception.getResponse() as typeof error;
    }
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
