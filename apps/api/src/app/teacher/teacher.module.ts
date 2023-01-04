import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AssessmentModule } from './assessments/assessment.module';
import { CourseModule } from './courses/course.module';
import { EvaluationModule } from './evaluations/evaluation.module';

@Module({
  imports: [
    CourseModule,
    EvaluationModule,
    AssessmentModule,
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
    ]),
  ],
})
export class TeacherModule {}
