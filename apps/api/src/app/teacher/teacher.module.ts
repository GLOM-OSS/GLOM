import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CourseModule } from './courses/course.module';
import { EvaluationModule } from './evaluations/evaluation.module';

@Module({
  imports: [
    CourseModule,
    EvaluationModule,
    RouterModule.register([
      {
        path: '/courses',
        module: CourseModule,
      },
      {
        path: '/evaluations',
        module: EvaluationModule,
      },
    ]),
  ],
})
export class TeacherModule {}
