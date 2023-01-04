import { Module } from '@nestjs/common';
import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';

@Module({
  providers: [ResourceService],
  controllers: [ResourceController],
})
export class ResourceModule {}
