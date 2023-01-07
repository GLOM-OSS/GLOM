import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AssessmentModule } from './assessments/assessment.module';
import { CourseModule } from './courses/course.module';
import { EvaluationModule } from './evaluations/evaluation.module';
import { PresenceListModule } from './presence-lists/presence-list.module';

@Module({
  imports: [
    CourseModule,
    EvaluationModule,
    AssessmentModule,
    PresenceListModule,
    RouterModule.register([
      {
        path: '/courses',
        module: CourseModule,
      },
      {
        path: '/evaluations',
        module: EvaluationModule,
      },
      {
        path: '/assessments',
        module: AssessmentModule,
      },
      {
        path: '/presence-lists',
        module: PresenceListModule,
      },
    ]),
  ],
})
export class TeacherModule {}
