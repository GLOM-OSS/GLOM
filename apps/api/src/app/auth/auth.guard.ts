import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TasksService } from '@squoolr/tasks';
import { Request } from 'express';
import { sAUTH403 } from '../../errors';
import { SchoolService } from '../../services/school.service';
import { DeserializeSessionData } from '../../utils/types';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tasksService: TasksService,
    private schoolService: SchoolService
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler()
    );
    const user = request.user as DeserializeSessionData;
    const squoolr_client = new URL(request.headers.origin).hostname;
    const isAuthenticated =
      isPublic ||
      (request.isAuthenticated() &&
        (await this.isClientCorrect(user, squoolr_client)));
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
        return isAuthenticated;
      } catch (error) {
        Logger.error(error.message, 'SEVER RESTART');
      }
    }
    throw new HttpException(sAUTH403['Fr'], HttpStatus.FORBIDDEN);
  }

  async isClientCorrect(
    {
      login_id,
      annualConfigurator,
      annualRegistry,
      annualStudent,
      annualTeacher,
    }: DeserializeSessionData,
    squoolr_client: string
  ) {
    const school = await this.schoolService.findOne({
      Logins: {
        some: { login_id },
      },
    });
    return (
      (login_id && squoolr_client === process.env.SQUOOLR_URL) ||
      (annualStudent && squoolr_client === school?.subdomain) ||
      ((annualConfigurator || annualRegistry || annualTeacher) &&
        squoolr_client === `admin.${school?.subdomain}`)
    );
  }
}
