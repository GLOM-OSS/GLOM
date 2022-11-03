import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from './types';

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

  async getYearCode(
    school_id: string,
    starting_year: number,
    ending_year: number
  ) {
    const numberOfAcademicYears = await this.prismaService.academicYear.count({
      where: { school_id },
    });
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

  async getMajorCode(acronym: string, department_code: string) {
    const numberOfMajors = await this.prismaService.annualMajor.findMany({
      distinct: ['major_acronym'],
      where: { major_acronym: acronym },
    });

    const { department_acronym } =
      await this.prismaService.department.findUnique({
        where: { department_code },
      });
    return `${department_acronym}${acronym}${this.getNumberString(
      numberOfMajors.length + 1
    )}`;
  }

  async getClassCode(level: number, major_code: string) {
    const { major_acronym } = await this.prismaService.major.findUnique({
      where: { major_code },
    });
    const classroom_acronym = `${major_acronym}${level}`;
    const numberOfClassrooms = await this.prismaService.classroom.count({
      where: { classroom_acronym },
    });

    return `${classroom_acronym}${this.getNumberString(
      numberOfClassrooms + 1
    )}`;
  }

  async getTeacherCode(school_id: string) {
    const { school_acronym } = await this.prismaService.school.findUnique({
      select: { school_acronym: true },
      where: { school_id },
    });
    const numberOfTeachers = await this.prismaService.teacher.count({
      where: {
        AnnualTeachers: {
          some: {
            Login: { school_id },
          },
        },
      },
    });
    return `${school_acronym}TE${this.getNumberString(numberOfTeachers + 1)}`;
  }

  async getPersonnelCode(school_id: string, role: Role) {
    const { school_acronym } = await this.prismaService.school.findUnique({
      select: { school_acronym: true },
      where: { school_id },
    });
    let numberOfPersonnel = 0;
    let personnelCode: string;
    if (role === Role.REGISTRY) {
      numberOfPersonnel = await this.prismaService.annualRegistry.count({
        where: { Login: { school_id } },
      });
      personnelCode = `${school_acronym}SA${this.getNumberString(
        numberOfPersonnel + 1
      )}`;
    } else if (role === Role.CONFIGURATOR) {
      numberOfPersonnel = await this.prismaService.annualConfigurator.count({
        where: { Login: { school_id } },
      });
      personnelCode = `${school_acronym}SE${this.getNumberString(
        numberOfPersonnel + 1
      )}`;
    }
    return personnelCode;
  }
}
