import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CodeGeneratorService } from '../../../utils/code-generator';
import { PersonnelController } from './personnel.controller';
import { PersonnelService } from './personnel.service';
import { TeacherModule } from './teacher/teacher.module';

@Module({
  imports: [
    TeacherModule,
    RouterModule.register([
      {
        path: 'personnel',
        module: PersonnelModule,
        children: [
          {
            path: 'teachers',
            module: TeacherModule,
          },
        ],
      },
    ]),
  ],
  controllers: [PersonnelController],
  providers: [PersonnelService, CodeGeneratorService],
})
export class PersonnelModule {}
