import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CourseModule } from './course/course.module';

@Module({
  imports: [
    CourseModule,
    RouterModule.register([
      {
        path: '/courses',
        module: CourseModule,
      },
    ]),
  ],
})
export class TeacherModule {}
