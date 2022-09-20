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
import { sAUTH403 } from '../../errors';
import { DeserializeSessionData } from '../../utils/types';
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
    return isPublic
      ? isPublic
      : request.isAuthenticated()
      ? this.authenticateUser(request)
      : false;
  }

  async authenticateUser(request: Request) {
    const user = request.user as DeserializeSessionData;
    const squoolr_client = new URL(request.headers.origin).hostname;

    const isAuthenticated = this.authservice.isClientCorrect(
      user,
      squoolr_client
    );
    if (isAuthenticated) {
      const {
        session: {
          passport: {
            user: { cookie_age, job_name },
          },
        },
      } = request;
      const now = new Date();
      try {
        this.tasksService.updateCronTime(
          job_name,
          new Date(now.setSeconds(now.getSeconds() + cookie_age))
        );
        return true;
      } catch (error) {
        Logger.error(error.message, AuthenticatedGuard.name);
      }
    }
    throw new HttpException(sAUTH403['Fr'], HttpStatus.FORBIDDEN);
  }
}
