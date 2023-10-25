import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { MetadataEnum, Role } from './auth.decorator';
import { AuthService } from './auth.service';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const { IS_PRIVATE, IS_PUBLIC, ROLES } = MetadataEnum;
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC,
      context.getHandler()
    );
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isAuthenticated = isPublic ? isPublic : request.isAuthenticated();
    if (!isAuthenticated) {
      await this.authService.closeSession(request.sessionID, {
        closed_at: new Date(),
      });
      throw new ForbiddenException();
    }

    const isOriginValid = await this.authService.validateOrigin(
      request.user,
      new URL(request.headers.origin).host
    );
    if (!isOriginValid) throw new ForbiddenException('Invalid origin !!!');

    if (roles) {
      const isAccessValid = this.validateRoleAccess(request.user, roles);
      if (!isAccessValid)
        throw new ForbiddenException('Insufficient privileges !!!');
    }

    const isPrivate = this.reflector.get<boolean>(
      IS_PRIVATE,
      context.getHandler()
    );
    if (isPrivate) {
      const isPrivateCodeValid = await this.validatePrivateCode(
        request,
        roles[0]
      );
      if (!isPrivateCodeValid)
        throw new ForbiddenException('Invalid confirmation code !!!');
    }
    return isAuthenticated;
  }

  async validateRoleAccess(user: Express.User, metaRoles: Role[]) {
    return metaRoles.some(
      (role) =>
        (user.tutorStudentIds && role === Role.PARENT) ||
        (user.annualConfigurator && role === Role.CONFIGURATOR) ||
        (user.annualRegistry && role === Role.REGISTRY) ||
        (user.annualTeacher && role === Role.TEACHER) ||
        (user.annualStudent && role === Role.STUDENT) ||
        (!user.school_id && role === Role.ADMIN)
    );
  }

  async validatePrivateCode(request: Request, role: Role) {
    const private_code = request.body['private_code'] as string | '';

    if (role === Role.TEACHER) {
      const {
        annualTeacher: { teacher_id },
      } = request.user as Express.User;
      return await this.authService.verifyPrivateCode(role, {
        private_code,
        user_id: teacher_id,
      });
    } else if (role === Role.REGISTRY) {
      const {
        annualRegistry: { annual_registry_id },
      } = request.user as Express.User;
      return await this.authService.verifyPrivateCode(role, {
        private_code,
        user_id: annual_registry_id,
      });
    } else
      throw new HttpException(
        `Private decorator can only with method protected by a teacher or registry role.`,
        HttpStatus.MISDIRECTED
      );
  }
}
