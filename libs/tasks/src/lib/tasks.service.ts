import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob, CronTime } from 'cron';
import { randomUUID } from 'crypto';

export enum CronJobEvents {
  AUTO_LOGOUT = 'AUTO_LOGOUT',
}

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  /**
   * Create new cron job and returns a unique job name
   * @param event event of the job cron to be created
   * @param execute_at execution time. If a date is provided the job will be executed once.
   * @param callback callback function to execute
   * @returns unique job name
   */
  addCronJob(
    event: CronJobEvents,
    execute_at: Date | CronExpression,
    callback: () => void
  ) {
    const cronName = `${event}-${randomUUID().split('-')[0]}`;
    const job = new CronJob(execute_at, () => {
      if (typeof execute_at !== 'string') job.stop();
      callback();
      this.logger.verbose(`cron ${cronName} executed`);
    });

    this.schedulerRegistry.addCronJob(cronName, job);
    job.start();

    this.logger.warn(
      `${cronName} added with for ${execute_at.toLocaleString()}`
    );
    return cronName;
  }

  /**
   * Update or create new job with the given cron name and time.
   * @param job_name name of the job to be updated
   * @param execute_at next execution time
   * @param callback If you wish to create a new job with thesame name and execution time then provide this argument so it can be attributed to it
   */
  upsertCronTime(job_name: string, execute_at: Date, callback?: () => void) {
    try {
      this.schedulerRegistry
        .getCronJob(job_name)
        .setTime(new CronTime(execute_at));
      this.logger.debug(`Updated ${job_name} to ${execute_at.toUTCString()}`);
    } catch (error) {
      if (callback) {
        const job = new CronJob(execute_at, () => {
          job.stop();
          callback();
          this.logger.verbose(`cron ${job_name} executed`);
        });
        this.schedulerRegistry.addCronJob(job_name, job);
        this.logger.warn(
          `${job_name} added with for ${execute_at.toUTCString()}`
        );
        job.start();
      } else Logger.error(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
