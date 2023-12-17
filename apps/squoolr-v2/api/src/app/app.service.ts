import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import {
  PlatformSettingsEntity,
  SubjectPartEntity,
  TeacherTypeEntity,
  TeachingGradeEntity,
} from './app.dto';
import { CycleEntity } from '../modules/modules.dto';

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

  async getCycles() {
    const cycles = await this.prismaService.cycle.findMany();
    return cycles.map((cycle) => new CycleEntity(cycle));
  }

  async getSubjectParts() {
    const subjectParts = await this.prismaService.subjectPart.findMany();
    return subjectParts.map((cycle) => new SubjectPartEntity(cycle));
  }
}
