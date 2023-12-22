import { Global, Module } from '@nestjs/common';
import { CodeGeneratorFactory } from '../../helpers/code-generator.factory';
import { AcademicYearsService } from '../../modules/academic-years/academic-years.service';
import { AuthController } from './auth.controller';
import { AuthSerializer } from './auth.serializer';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local/local.strategy';
import { LogsService } from './logs/logs.service';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';

@Global()
@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [
    AuthService,
    LogsService,
    LocalStrategy,
    AuthSerializer,
    CodeGeneratorFactory,
    AcademicYearsService,
    SchedulerRegistry,
  ],
  exports: [AuthService, LogsService],
  controllers: [AuthController],
})
export class AuthModule {}
