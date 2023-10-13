import { GlomExceptionResponse } from '@glom/execeptions';
import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

export const errorCodeMappings: Record<string, number> = {
  P2002: HttpStatus.CONFLICT,
  P2001: HttpStatus.NOT_FOUND,
  P2000: HttpStatus.BAD_REQUEST,
  P2006: HttpStatus.BAD_REQUEST,
  P2011: HttpStatus.FAILED_DEPENDENCY,
  P2025: HttpStatus.FAILED_DEPENDENCY,
};

@Catch(Prisma.PrismaClientKnownRequestError, Prisma.PrismaClientValidationError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const error = exception.code;
    const httpStatus = errorCodeMappings[error];
    if (!httpStatus) super.catch(exception, host); // Handle unknown error codes
    Logger[httpStatus === 500 ? 'error' : 'debug'](exception.message, error);

    response.status(httpStatus).json(
      new GlomExceptionResponse({
        error,
        path: request.url,
        timestamp: Date.now(),
        message: exception.message,
      })
    );
  }
}
