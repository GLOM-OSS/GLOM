import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

export class GoogleGuard extends AuthGuard('google') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    try {
      const result = (await super.canActivate(context)) as boolean;
      await super.logIn(request);
      return result;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
