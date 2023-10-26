import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GlomPrismaService } from '@glom/prisma';
import { Role } from '../app/auth/auth.decorator';

@Injectable()
export class CodeGeneratorFactory {
  constructor(private prismaService: GlomPrismaService) {}
  formatNumber(number: number) {
    return number < 10
      ? `000${number}`
      : number < 100
      ? `00${number}`
      : number < 1000
      ? `0${number}`
      : `${number}`;
  }

  getAnonymityCode() {
    return Math.random().toString(36).slice(2).toUpperCase();
  }

  async getYearCode(
    starting_year: number,
    ending_year: number,
    school_id?: string
  ) {
    const number_of_academic_years = school_id
      ? await this.prismaService.academicYear.count({
          where: { school_id: school_id },
        })
      : 0;
    return `YEAR-${starting_year}${ending_year}${this.formatNumber(
      number_of_academic_years + 1
    )}`;
  }

  async getSchoolCode(acronym: string) {
    const number_of_schools = await this.prismaService.school.count({
      where: { school_acronym: acronym },
    });
    return `${acronym}${this.formatNumber(number_of_schools + 1)}`;
  }

  async getDepartmentCode(acronym: string, school_id: string) {
    const number_of_departments = await this.prismaService.department.count({
      where: { school_id },
    });

    const { school_acronym } = await this.prismaService.school.findUnique({
      where: { school_id },
    });
    return `${school_acronym}${acronym}${this.formatNumber(
      number_of_departments + 1
    )}`;
  }

  async getMajorCode(acronym: string, department_code: string) {
    const { department_acronym } =
      await this.prismaService.department.findUnique({
        where: { department_code },
      });
    const major_acronym = `${department_acronym}${acronym}`;
    const number_of_majors = await this.prismaService.major.count({
      where: { major_acronym },
    });
    return `${department_acronym}${acronym}${this.formatNumber(
      number_of_majors + 1
    )}`;
  }

  async getClassCode(level: number, major_code: string) {
    const { major_acronym } = await this.prismaService.major.findUnique({
      where: { major_code },
    });
    const classroom_acronym = `${major_acronym}${level}`;
    const number_of_classrooms = await this.prismaService.classroom.count({
      where: { classroom_acronym },
    });

    return `${classroom_acronym}${this.formatNumber(number_of_classrooms + 1)}`;
  }

  async getPersonnelCode(school_id: string, role: Role) {
    const { school_acronym } = await this.prismaService.school.findUnique({
      select: { school_acronym: true },
      where: { school_id },
    });
    switch (role) {
      case Role.REGISTRY: {
        const number_of_registries =
          await this.prismaService.annualRegistry.count({
            where: { Login: { school_id } },
          });
        return `${school_acronym}SA${this.formatNumber(
          number_of_registries + 1
        )}`;
      }
      case Role.CONFIGURATOR: {
        const number_of_configurators =
          await this.prismaService.annualConfigurator.count({
            where: { Login: { school_id } },
          });
        return `${school_acronym}SE${this.formatNumber(
          number_of_configurators + 1
        )}`;
      }
      case Role.TEACHER || Role.COORDINATOR: {
        const number_of_teachers = await this.prismaService.teacher.count({
          where: {
            AnnualTeachers: {
              some: {
                Login: { school_id },
              },
            },
          },
        });
        return `${school_acronym}TE${this.formatNumber(
          number_of_teachers + 1
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
    const starts_with = `UE${school_acronym}${acronym}`;
    const number_of_modules = await this.prismaService.annualCreditUnit.count({
      where: { credit_unit_code: { startsWith: starts_with } },
    });

    return `${starts_with}${this.formatNumber(number_of_modules) + 1}`;
  }

  async getCreditUnitSubjectCode(school_id: string, acronym: string) {
    const { school_acronym } = await this.prismaService.school.findUnique({
      select: { school_acronym: true },
      where: { school_id },
    });
    const starts_with = `UV${school_acronym}${acronym}`;
    const number_of_subjects =
      await this.prismaService.annualCreditUnitSubject.findMany({
        distinct: ['subject_code'],
        where: { subject_code: { startsWith: starts_with } },
      });
    return `${starts_with}${this.formatNumber(number_of_subjects.length) + 1}`;
  }

  async getGroupCodes(annual_subject_id: string, number_of_groups: number) {
    const { subject_code } =
      await this.prismaService.annualCreditUnitSubject.findUniqueOrThrow({
        where: { annual_credit_unit_subject_id: annual_subject_id },
      });
    const number_of_created_groups = (
      await this.prismaService.assignmentGroupMember.findMany({
        distinct: 'group_code',
        where: {
          Assessment: { annual_credit_unit_subject_id: annual_subject_id },
        },
      })
    ).length;
    return [...new Array(number_of_groups)].map(
      (_, index) =>
        `G${this.formatNumber(
          number_of_created_groups + index
        )}~${subject_code}`
    );
  }
}
