import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { sAUTH403 } from '../../errors';
import { SchoolService } from '../../services/school.service';
import { DeserializeSessionData } from '../../utils/types';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private schoolService: SchoolService
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler()
    );
    const user = request.user as DeserializeSessionData;
    const squoolr_client = request.headers.host.replace('https://', '');

    const isAuthenticated =
      isPublic ||
      (request.isAuthenticated() &&
        (await this.isClientCorrect(user, squoolr_client)));
    if (isAuthenticated) return isAuthenticated;
    else throw new HttpException(sAUTH403['Fr'], HttpStatus.FORBIDDEN);
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
