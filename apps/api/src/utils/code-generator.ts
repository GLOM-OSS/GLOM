import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    const { department_acronym } =
      await this.prismaService.department.findUnique({
        where: { department_code },
      });
    const major_acronym = `${department_acronym}${acronym}`;
    const numberOfMajors = await this.prismaService.major.count({
      where: { major_acronym },
    });
    return `${department_acronym}${acronym}${this.getNumberString(
      numberOfMajors + 1
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

  async getPersonnelCode(school_id: string, role: Role) {
    const { school_acronym } = await this.prismaService.school.findUnique({
      select: { school_acronym: true },
      where: { school_id },
    });
    switch (role) {
      case Role.REGISTRY: {
        const numberOfRegistries =
          await this.prismaService.annualRegistry.count({
            where: { Login: { school_id } },
          });
        return `${school_acronym}SA${this.getNumberString(
          numberOfRegistries + 1
        )}`;
      }
      case Role.CONFIGURATOR: {
        const numberOfConfigurators =
          await this.prismaService.annualConfigurator.count({
            where: { Login: { school_id } },
          });
        return `${school_acronym}SE${this.getNumberString(
          numberOfConfigurators + 1
        )}`;
      }
      case Role.TEACHER || Role.COORDINATOR: {
        const numberOfTeachers = await this.prismaService.teacher.count({
          where: {
            AnnualTeachers: {
              some: {
                Login: { school_id },
              },
            },
          },
        });
        return `${school_acronym}TE${this.getNumberString(
          numberOfTeachers + 1
        )}`;
      }
      default:
        throw new HttpException(
          `${role} is not handled yet. Please use only personnel role`,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }

  async getCreditUnitCode(school_id: string, acronym: string) {
    const { school_acronym } = await this.prismaService.school.findUnique({
      select: { school_acronym: true },
      where: { school_id },
    });
    const startsWith = `UE${school_acronym}${acronym}`;
    const numberOfUEs = await this.prismaService.annualCreditUnit.count({
      where: { credit_unit_code: { startsWith } },
    });

    return `${startsWith}${this.getNumberString(numberOfUEs) + 1}`;
  }

  async getCreditUnitSubjectCode(school_id: string, acronym: string) {
    const { school_acronym } = await this.prismaService.school.findUnique({
      select: { school_acronym: true },
      where: { school_id },
    });
    const startsWith = `UV${school_acronym}${acronym}`;
    const numberOfUVs =
      await this.prismaService.annualCreditUnitSubject.findMany({
        distinct: ['subject_code'],
        where: { subject_code: { startsWith } },
      });
    return `${startsWith}${this.getNumberString(numberOfUVs.length) + 1}`;
  }

  async getGroupCodes(
    annual_credit_unit_subject_id: string,
    numberOfGroups: number
  ) {
    const { subject_code } =
      await this.prismaService.annualCreditUnitSubject.findUniqueOrThrow({
        where: { annual_credit_unit_subject_id },
      });
    const numberOfCreatedGroups =
      await this.prismaService.assignmentGroupMember.count({
        distinct: 'group_code',
        where: { Assessment: { annual_credit_unit_subject_id } },
      });
    return new Array(numberOfGroups).map(
      (_, index) =>
        `G${this.getNumberString(
          numberOfCreatedGroups + index
        )}#${subject_code}`
    );
  }
}
