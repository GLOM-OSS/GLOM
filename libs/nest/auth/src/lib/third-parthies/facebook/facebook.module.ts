import { Module } from '@nestjs/common';
import { FacebookStrategy } from './facebook.strategy';
import { FacebookController } from './facebook.controller';

@Module({
  controllers: [FacebookController],
  providers: [FacebookStrategy],
})
export class FacebookModule {}
