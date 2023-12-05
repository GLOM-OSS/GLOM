import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import {
  PlatformSettingsEntity,
  TeacherTypeEntity,
  TeachingGradeEntity,
} from './app.dto';

@Injectable()
export class AppService {
  constructor(private prismaService: GlomPrismaService) {}

  getData(): { message: string } {
    return { message: 'Welcome to api!' };
  }

  async getPlatformSettings() {
    const platformSettings =
      await this.prismaService.platformSettings.findFirst();
    return new PlatformSettingsEntity(platformSettings);
  }

  async getTeacherTypes() {
    const teacherTypes = await this.prismaService.teacherType.findMany();
    return teacherTypes.map(
      (teacherType) => new TeacherTypeEntity(teacherType)
    );
  }

  async getTeachingGrades() {
    const teacherGrades = await this.prismaService.teachingGrade.findMany();
    return teacherGrades.map(
      (teacherGrade) => new TeachingGradeEntity(teacherGrade)
    );
  }
}
