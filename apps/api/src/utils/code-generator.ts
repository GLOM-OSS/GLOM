import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CodeGeneratorService {
  constructor(private prismaService: PrismaService) {}
  getNumberString(number: number) {
    return number < 10
      ? `000${number}`
      : number < 100
      ? `00${number}`
      : number < 1000
      ? `0${number}`
      : `${number}`;
  }

  async getYearCode(starting_year: number, ending_year: number) {
    const numberOfAcademicYears = await this.prismaService.academicYear.count();
    return `YEAR-${starting_year}${ending_year}${this.getNumberString(
      numberOfAcademicYears + 1
    )}`;
  }

  async getSchoolCode(acronym: string) {
    const numberOfSchools = await this.prismaService.school.count({
      where: { school_acronym: acronym },
    });
    return `${acronym}${this.getNumberString(numberOfSchools + 1)}`;
  }

  async getDepartmentCode(acronym: string, school_id: string) {
    const numberOfDepartment = await this.prismaService.department.count({
      where: { school_id },
    });

    const { school_acronym } = await this.prismaService.school.findUnique({
      where: { school_id },
    });
    return `${school_acronym}${acronym}${this.getNumberString(
      numberOfDepartment + 1
    )}`;
  }

  async getMajorCode(acronym: string, department_id: string) {
    const numberOfMajors = await this.prismaService.annualMajor.count({
      distinct: ['major_acronym'],
      where: { department_id },
    });

    const { department_acronym } =
      await this.prismaService.department.findUnique({
        where: { department_id },
      });
    return `${department_acronym}${acronym}${this.getNumberString(
      numberOfMajors + 1
    )}`;
  }

  async getClassCode(acronym: string, major_id: string) {
    const numberOfClassrooms = await this.prismaService.classroom.count({
      where: { major_id },
    });

    const { major_acronym } = await this.prismaService.major.findUnique({
      where: { major_id },
    });
    return `${major_acronym}${acronym}${this.getNumberString(
      numberOfClassrooms
    )}`;
  }
}
