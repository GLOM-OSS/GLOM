import { ExecutionContext } from '@nestjs/common';
import { AuthGuard,  } from '@nestjs/passport';
import { Request } from 'express';

export class GoogleGuard extends AuthGuard('google') {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest<Request>();
    await super.logIn(request);
    return result;
  }
}
