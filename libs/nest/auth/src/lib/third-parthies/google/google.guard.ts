import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { GlomStrategy } from '../../glom-auth.type.d';

export class GoogleGuard extends AuthGuard('google' as GlomStrategy) {
  constructor() {
    super({
      callbackURL: `${process.env.NX_API_BASE_URL}/auth/third-parthies/google/callback`,
      clientSecret: process.env.GOOGLE_SECRET,
      clientID: process.env.GOOGLE_CLIENT_ID,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

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
