import { Module } from '@nestjs/common';
import { CourseModulesService } from './modules/modules.service';
import { CourseModulesController } from './modules/modules.controller';

@Module({
  providers: [CourseModulesService],
  controllers: [CourseModulesController],
})
export class CoursesModule {}
