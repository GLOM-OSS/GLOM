import { Global, Module } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { TasksService } from './tasks.service';

@Global()
@Module({
  providers: [TasksService, SchedulerRegistry],
  exports: [TasksService],
})
export class TasksModule {}
