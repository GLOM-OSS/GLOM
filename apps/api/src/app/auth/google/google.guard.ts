import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AUTH400 } from '../../../errors';
import { Request } from 'express';

export class GoogleGuard extends AuthGuard('google') {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    try {
      const result = (await super.canActivate(context)) as boolean;
      await super.logIn(request);
      return result;
    } catch (error) {
      throw new HttpException(AUTH400['Fr'], HttpStatus.BAD_REQUEST);
    }
  }
}
