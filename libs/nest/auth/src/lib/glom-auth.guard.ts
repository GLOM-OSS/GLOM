import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { User } from './glom-auth.type';
import { GlomAuthService } from './glom-auth.service';
import { MetadataEnum } from './glom-auth.decorator';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: GlomAuthService
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const { IS_PUBLIC, ROLES } = MetadataEnum;
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC,
      context.getHandler()
    );

    if (isPublic) return isPublic;
    const isAuthenticated = request['isAuthenticated']();
    if (isAuthenticated) {
      const origin = new URL(request.headers.origin).host;
      const { role_id } = request['user'] as User;
      const roles = this.reflector.getAllAndOverride<string[] | null>(ROLES, [
        context.getHandler(),
        context.getClass(),
      ]);
      return await this.authService.isAuthorized(origin, role_id, roles);
    }
    return isAuthenticated;
  }
}
