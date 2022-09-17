import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob, CronTime } from 'cron';
import { randomUUID } from 'crypto';

export enum CronJobNames {
  AUTO_LOGOUT = 'AUTO_LOGOUT',
}

type SkltnCronJob = { name: CronJobNames; callback: () => void };

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  addCronJob({ name, callback }: SkltnCronJob, execute_at: Date) {
    const cronName = `${name}-${randomUUID().split('-')[0]}`;
    const job = new CronJob(execute_at, () => {
      job.stop();
      callback();
      this.logger.verbose(`cron ${cronName} executed`);
    });

    this.schedulerRegistry.addCronJob(cronName, job);
    job.start();

    this.logger.warn(`${cronName} added with for ${execute_at.toUTCString()}`);
    return cronName;
  }

  updateCronTime(job_name: string, execute_at: Date) {
    this.schedulerRegistry
      .getCronJob(job_name)
      .setTime(new CronTime(execute_at));
    this.logger.debug(`Updated ${job_name} to ${execute_at.toUTCString()}`);
  }
}
