import { Module } from '@nestjs/common';
import { AmbassadorsService } from './ambassadors.service';
import { AmbassadorsController } from './ambassadors.controller';

@Module({
  providers: [AmbassadorsService],
  controllers: [AmbassadorsController],
})
export class AmbassadorsModule {}
