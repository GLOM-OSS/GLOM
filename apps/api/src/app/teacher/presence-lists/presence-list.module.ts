import { Module } from '@nestjs/common';
import { PresenceListController } from './presence-list.controller';
import { PresenceListService } from './presence-list.service';

@Module({
  controllers: [PresenceListController],
  providers: [PresenceListService],
})
export class PresenceListModule {}
