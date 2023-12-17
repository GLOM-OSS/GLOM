import { Module } from '@nestjs/common';
import { CourseModulesService } from './modules/modules.service';
import { CourseModulesController } from './modules/modules.controller';
import { CourseSubjectsService } from './subjects/subjects.service';
import { CourseSubjectsController } from './subjects/subjects.controller';

@Module({
  providers: [CourseModulesService, CourseSubjectsService],
  controllers: [CourseModulesController, CourseSubjectsController],
})
export class CoursesModule {}
