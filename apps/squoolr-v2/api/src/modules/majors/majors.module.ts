import { Module } from '@nestjs/common';
import { MajorsController } from './majors.controller';
import { MajorsService } from './majors.service';

@Module({
  providers: [MajorsService],
  controllers: [MajorsController],
})
export class MajorsModule {}
