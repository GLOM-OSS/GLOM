import { Module } from '@nestjs/common';
import { ChapterModule } from './chapters/chapter.module';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { ResourceModule } from './resources/resource.module';

@Module({
  imports: [
    ChapterModule,
    ResourceModule,
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
