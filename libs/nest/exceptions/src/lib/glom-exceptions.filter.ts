import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GlomExceptionResponse } from './glom-exceptions.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

type Exception = HttpException | PrismaClientKnownRequestError;

@Catch(HttpException, PrismaClientKnownRequestError)
export class GlomExceptionsFilter implements ExceptionFilter {
  catch(exception: Exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let status = 500;
    let error = {
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Request could not be completed!!!',
    };
    status =
      exception instanceof PrismaClientKnownRequestError
        ? 404
        : exception.getStatus();
    error =
      exception instanceof PrismaClientKnownRequestError
        ? { error: exception.code, message: exception.message }
        : (exception.getResponse() as typeof error);
    Logger[status === 500 ? 'error' : 'debug'](
      `Called {${request.url}, ${request.method}}`,
      error['error']
    );

    response.status(status).json(
      new GlomExceptionResponse({
        path: request.url,
        timestamp: Date.now(),
        error: error['error'],
        message: error['message']?.toString(),
      })
    );
  }
}
