import { Module } from '@nestjs/common';
import { CodeGeneratorFactory } from '../../helpers/code-generator.factory';
import { ChaptersModule } from './chapters/chapters.module';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { CourseModulesController } from './modules/modules.controller';
import { CourseModulesService } from './modules/modules.service';
import { SubjectsModule } from './subjects/subjects.module';

@Module({
  imports: [SubjectsModule, ChaptersModule],
  controllers: [CoursesController, CourseModulesController],
  providers: [CoursesService, CourseModulesService, CodeGeneratorFactory],
})
export class CoursesModule {}
