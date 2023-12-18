import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GlomPrismaService } from '@glom/prisma';
import { StaffRole } from '../utils/enums';

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

  async getPersonnelCode(school_id: string, role: StaffRole) {
    const { school_acronym } = await this.prismaService.school.findUnique({
      select: { school_acronym: true },
      where: { school_id },
    });
    switch (role) {
      case StaffRole.REGISTRY: {
        const number_of_registries =
          await this.prismaService.annualRegistry.count({
            where: { Login: { school_id } },
          });
        return `${school_acronym}SA${this.formatNumber(
          number_of_registries + 1
        )}`;
      }
      case StaffRole.CONFIGURATOR: {
        const number_of_configurators =
          await this.prismaService.annualConfigurator.count({
            where: { Login: { school_id } },
          });
        return `${school_acronym}SE${this.formatNumber(
          number_of_configurators + 1
        )}`;
      }
      case StaffRole.TEACHER:
      case StaffRole.COORDINATOR: {
        const number_of_teachers = await this.prismaService.teacher.count({
          where: {
            AnnualTeachers: { some: { Teacher: { Login: { school_id } } } },
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

  async getModuleCode(school_id: string, acronym: string) {
    const { school_acronym } = await this.prismaService.school.findUnique({
      select: { school_acronym: true },
      where: { school_id },
    });
    const starts_with = `UE${school_acronym}${acronym}`;
    const number_of_modules = await this.prismaService.annualModule.count({
      where: { module_code: { startsWith: starts_with } },
    });

    return `${starts_with}${this.formatNumber(number_of_modules) + 1}`;
  }

  async getSubjectCode(school_id: string, acronym: string) {
    const { school_acronym } = await this.prismaService.school.findUnique({
      select: { school_acronym: true },
      where: { school_id },
    });
    const starts_with = `UV${school_acronym}${acronym}`;
    const number_of_subjects = await this.prismaService.annualSubject.findMany({
      distinct: ['subject_code'],
      where: { subject_code: { startsWith: starts_with } },
    });
    return `${starts_with}${this.formatNumber(number_of_subjects.length) + 1}`;
  }

  async getGroupCodes(annual_subject_id: string, number_of_groups: number) {
    const { subject_code } =
      await this.prismaService.annualSubject.findUniqueOrThrow({
        where: { annual_subject_id },
      });
    const number_of_created_groups = (
      await this.prismaService.assignmentGroupMember.findMany({
        distinct: 'group_code',
        where: {
          Assessment: { annual_subject_id },
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
