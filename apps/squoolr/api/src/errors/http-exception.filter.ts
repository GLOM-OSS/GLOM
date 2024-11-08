import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
  Logger,
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
    let errorMessage: string = message ?? exception.message;
    try {
      errorMessage =
        JSON.parse(errorMessage)[(request.headers['lang'] as string) || 'fr'];
    } catch (error) {
      Logger.error(errorMessage, request.url);
      errorMessage = errorMessage.includes('prisma')
        ? `Sorry, we couldn't persist your data. Contact your developer with this error: ${errorMessage.slice(
            errorMessage.indexOf('.') + 1,
            errorMessage.indexOf('()')
          )} received invalid args.`
        : errorMessage;
    }
    response.status(statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR).json({
      error,
      path: request.url,
      timestamp: new Date().toISOString(),
      message: errorMessage,
      statusCode: statusCode ?? exception.getStatus(),
    });
  }
}
