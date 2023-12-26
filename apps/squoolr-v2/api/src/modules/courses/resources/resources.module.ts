import { Module } from '@nestjs/common';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';
import { GlomMulterModule } from '@glom/multer';

@Module({
  imports: [GlomMulterModule.register()],
  controllers: [ResourcesController],
  providers: [ResourcesService],
})
export class ResourcesModule {}
