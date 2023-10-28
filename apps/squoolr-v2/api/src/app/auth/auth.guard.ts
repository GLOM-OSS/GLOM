import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { MetadataEnum, Role } from './auth.decorator';
import { AuthService } from './auth.service';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getRequest<Response>();
    const { IS_PRIVATE, IS_PUBLIC, ROLES } = MetadataEnum;
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC,
      context.getHandler()
    );
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isAuthenticated = isPublic ? isPublic : request.isAuthenticated();
    if (!isAuthenticated) {
      const sessionID = request.headers.cookie?.split('=s%3A')[1].split('.')[0];
      if (sessionID) {
        await this.authService.closeSession(sessionID, {
          closed_at: new Date(),
        });
        response.clearCookie(process.env.SESSION_NAME);
      }
      throw new ForbiddenException();
    }

    const isOriginValid = await this.authService.validateOrigin(
      request.user,
      new URL(request.headers.origin).host
    );
    if (!isOriginValid) throw new ForbiddenException('Invalid origin !!!');

    if (
      requiredRoles &&
      !(await this.validateRoleAccess(request.user, requiredRoles))
    )
      throw new ForbiddenException('Insufficient privileges !!!');

    const isPrivate = this.reflector.get<boolean>(
      IS_PRIVATE,
      context.getHandler()
    );
    if (isPrivate && !(await this.validatePrivateCode(request, requiredRoles)))
      throw new ForbiddenException('Invalid confirmation code !!!');

    return isAuthenticated;
  }

  async validateRoleAccess(user: Express.User, roles: Role[]) {
    return roles.some(
      (role) =>
        (user.tutorStudentIds && role === Role.PARENT) ||
        (user.annualConfigurator && role === Role.CONFIGURATOR) ||
        (user.annualRegistry && role === Role.REGISTRY) ||
        (user.annualTeacher && role === Role.TEACHER) ||
        (user.annualStudent && role === Role.STUDENT) ||
        (!user.school_id && role === Role.ADMIN)
    );
  }

  async validatePrivateCode(request: Request, roles: Role[]) {
    const { annualTeacher, annualRegistry } = request.user;
    const private_code = request.body['private_code'];

    return (
      (roles.includes(Role.TEACHER) &&
        (await this.authService.verifyPrivateCode(Role.TEACHER, {
          private_code,
          user_id: annualTeacher?.teacher_id,
        }))) ||
      (roles.includes(Role.REGISTRY) &&
        (await this.authService.verifyPrivateCode(Role.REGISTRY, {
          private_code,
          user_id: annualRegistry?.annual_registry_id,
        })))
    );
  }
}
