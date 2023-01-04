import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from '../../../utils/multer.service';
import { ChapterModule } from './chapters/chapter.module';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { ResourceModule } from './resources/resource.module';

@Module({
  imports: [
    ChapterModule,
    ResourceModule,
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}