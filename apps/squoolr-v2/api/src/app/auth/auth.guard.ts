import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { MetadataEnum, Role } from '../../utils/enums';
import { AuthService } from './auth.service';
import { LogsService } from './logs/logs.service';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private logsService: LogsService
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const { IS_PRIVATE, IS_PUBLIC, ROLES } = MetadataEnum;
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC,
      context.getHandler()
    );
    if (isPublic) return isPublic;
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isAuthenticated = request.isAuthenticated();
    if (!isAuthenticated) throw new ForbiddenException();

    await this.logsService.update(request.sessionID, {
      updated_at: new Date(),
    });

    const isOriginValid = await this.authService.validateOriginAccess(
      request.user,
      new URL(request.headers.origin).host
    );
    if (!isOriginValid) throw new ForbiddenException('Invalid origin !!!');

    if (
      requiredRoles &&
      !(await this.authService.validateRolesAccess(request.user, requiredRoles))
    )
      throw new ForbiddenException('Insufficient privileges !!!');

    const isPrivate = this.reflector.get<boolean>(
      IS_PRIVATE,
      context.getHandler()
    );
    if (
      isPrivate &&
      !(await this.authService.validatePrivateAccess(request, requiredRoles))
    )
      throw new ForbiddenException('Invalid confirmation code !!!');

    return isAuthenticated;
  }
}
