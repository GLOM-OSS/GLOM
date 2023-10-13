import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TasksService } from '@glom/nest-tasks';
import { Request } from 'express';
import { User } from './auth';
import { MetadataEnum, Role } from './auth.decorator';
import { AuthService } from './auth.service';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private tasksService: TasksService
  ) {}

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
    const isAuthenticated = isPublic
      ? isPublic
      : request.isAuthenticated()
      ? await this.authenticateUser(request, roles)
      : false;
    if (!isAuthenticated) throw new ForbiddenException();

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
        throw new NotAcceptableException('Valid private code needed');
    }
    return isAuthenticated;
  }

  async authenticateUser(request: Request, metaRoles: Role[]) {
    const user = request.user as User;
    const {
      session: {
        passport: {
          user: { log_id, cookie_age, job_name, roles },
        },
      },
    } = request;

    let userHasTheAcess = true;
    if (metaRoles) {
      let hasRole = false;
      roles.forEach(({ role }) => {
        if (metaRoles.includes(role)) hasRole = true;
      });
      userHasTheAcess = hasRole;
    }

    const userClientCorrect = this.authService.isClientCorrect(
      user,
      new URL(request.headers.origin).host
    );
    if (!userHasTheAcess || !userClientCorrect)
      throw new ForbiddenException('Missing access or incorrect origin');
    const now = new Date();
    this.tasksService.upsertCronTime(
      job_name,
      new Date(now.setSeconds(now.getSeconds() + cookie_age)),
      () => {
        request.session.destroy(async (err) => {
          if (!err) await this.authService.closeSession(log_id);
        });
      }
    );
    return userClientCorrect;
  }

  async validatePrivateCode(request: Request, role: Role) {
    const private_code = request.body['private_code'] as string | '';

    if (role === Role.TEACHER) {
      const {
        annualTeacher: { teacher_id },
      } = request.user as User;
      return await this.authService.verifyPrivateCode(role, {
        private_code,
        user_id: teacher_id,
      });
    } else if (role === Role.REGISTRY) {
      const {
        annualRegistry: { annual_registry_id },
      } = request.user as User;
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