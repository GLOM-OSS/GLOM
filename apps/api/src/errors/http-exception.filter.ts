import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException, BadRequestException)
export class HttpExceptionFilter implements ExceptionFilter {
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { statusCode, error, message } = exception.getResponse() as any;
    // console.log(exception.message)
    response.status(statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR).json({
      error,
      path: request.url,
      timestamp: new Date().toISOString(),
      message: message ?? exception.message,
      statusCode: statusCode ?? exception.getStatus(),
    });
  }
}