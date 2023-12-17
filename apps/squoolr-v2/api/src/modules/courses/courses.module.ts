import { Module } from '@nestjs/common';
import { CourseModulesService } from './modules/modules.service';
import { CourseModulesController } from './modules/modules.controller';
import { CourseSubjectsService } from './subjects/subjects.service';
import { CourseSubjectsController } from './subjects/subjects.controller';
import { CodeGeneratorFactory } from '../../helpers/code-generator.factory';

@Module({
  controllers: [CourseModulesController, CourseSubjectsController],
  providers: [
    CourseModulesService,
    CourseSubjectsService,
    CodeGeneratorFactory,
  ],
})
export class CoursesModule {}
