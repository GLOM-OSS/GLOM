import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TasksService } from '@squoolr/tasks';
import { Request } from 'express';
import { AUTH05, sAUTH403 } from '../../errors';
import { DeserializeSessionData, Role } from '../../utils/types';
import { AuthService } from './auth.service';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authservice: AuthService,
    private tasksService: TasksService
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler()
    );
    const roles = this.reflector.get<Role[]>('roles', context.getClass());
    return isPublic
      ? isPublic
      : request.isAuthenticated()
      ? await this.authenticateUser(request, roles)
      : false;
  }

  async authenticateUser(request: Request, metaRoles: Role[]) {
    const user = request.user as DeserializeSessionData;
    const squoolr_client = new URL(request.headers.origin).hostname;
    const {
      session: {
        passport: {
          user: { cookie_age, job_name, roles },
        },
      },
    } = request;

    let userHasTheAcess = true;
    if (metaRoles) {
      let hasRole = false;
      roles.forEach(({ role }) => {
        if (metaRoles.includes(role)) hasRole = true;
      });
      userHasTheAcess = hasRole
    }

    const userClientCorrect = this.authservice.isClientCorrect(
      user,
      squoolr_client
    );
    if (!userHasTheAcess || !userClientCorrect)
      throw new HttpException(AUTH05['Fr'], HttpStatus.FORBIDDEN);
    const now = new Date();
    try {
      this.tasksService.updateCronTime(
        job_name,
        new Date(now.setSeconds(now.getSeconds() + cookie_age))
      );
      return userClientCorrect;
    } catch (error) {
      Logger.error(error.message, AuthenticatedGuard.name);
    }
    throw new HttpException(sAUTH403['Fr'], HttpStatus.FORBIDDEN);
  }
}
