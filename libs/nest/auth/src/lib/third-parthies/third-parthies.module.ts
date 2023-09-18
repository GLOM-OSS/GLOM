import { Module } from '@nestjs/common';
import { ThirdParthiesController } from './third-parthies.controller';

@Module({
  controllers: [ThirdParthiesController],
})
export class ThirdParthiesModule {}
