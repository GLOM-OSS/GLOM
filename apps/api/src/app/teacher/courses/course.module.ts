import { Module } from '@nestjs/common';
import { ChapterModule } from './chapters/chapter.module';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

@Module({
  imports: [ChapterModule],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
