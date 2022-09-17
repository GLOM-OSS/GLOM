import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Request } from 'express';
import { AuthService } from '../auth.service';

import { LogService } from '../../../services/log.service';
import { CronJobNames, TasksService } from '../../../tasks/tasks.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private logService: LogService,
    private tasksService: TasksService
  ) {
    super({
      usernameField: 'email',
      passReqToCallback: true,
    });
  }

  async validate(request: Request, email: string, password: string) {
    const origin = request.headers.origin.replace('https://', '');
    const user = await this.authService.validateUser(origin, email, password);
    const { log_id } = await this.logService.create({
      Login: { connect: { login_id: user.login_id } },
    });
    const now = new Date();
    const job_name = this.tasksService.addCronJob(
      {
        name: CronJobNames.AUTO_LOGOUT,
        callback: async () => {
          request.session.destroy(async (err) => {
            if (!err) {
              await this.logService.update({
                data: { closed_at: new Date() },
                where: { log_id },
              });
            }
          });
        },
      },
      new Date(now.setSeconds(now.getSeconds() + user.cookie_age))
    );
    return { log_id, ...user, job_name };
  }
}
