import { Module } from '@nestjs/common';
import { CodeGeneratorFactory } from '../../helpers/code-generator.factory';
import { ChaptersModule } from './chapters/chapters.module';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { CourseModulesController } from './modules/modules.controller';
import { CourseModulesService } from './modules/modules.service';
import { ResourcesModule } from './resources/resources.module';
import { SubjectsModule } from './subjects/subjects.module';
import { AssessmentsModule } from './assessments/assessments.module';

@Module({
  imports: [SubjectsModule, ChaptersModule, ResourcesModule, AssessmentsModule],
  controllers: [CoursesController, CourseModulesController],
  providers: [CoursesService, CourseModulesService, CodeGeneratorFactory],
})
export class CoursesModule {}
