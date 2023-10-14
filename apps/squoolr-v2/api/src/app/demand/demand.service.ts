import { GlomPrismaService } from '@glom/prisma';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CarryOverSystemEnum,
  Prisma,
  SchoolDemandStatus,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { CodeGeneratorFactory } from '../../helpers/code-generator.factory';
import {
  DemandDetails,
  SchoolEntity,
  SubmitDemandDto,
  ValidateDemandDto,
} from './demand.dto';

@Injectable()
export class DemandService {
  constructor(
    private prismaService: GlomPrismaService,
    private codeGenerator: CodeGeneratorFactory
  ) {}

  async findOne(school_code: string) {
    const school = await this.prismaService.school.findUnique({
      include: { SchoolDemand: true },
      where: { school_code },
    });
    if (!school) throw new NotFoundException('School demand not found');
    const {
      SchoolDemand: {
        demand_status,
        rejection_reason,
        referral_code,
        paid_amount,
      },
    } = school;
    return new SchoolEntity({
      ...school,
      paid_amount,
      referral_code,
      school_demand_status: demand_status,
      school_rejection_reason: rejection_reason,
    });
  }

  async findDetails(school_code: string) {
    const schoolData = await this.prismaService.school.findUnique({
      include: { SchoolDemand: true, Person: true },
      where: { school_code },
    });
    if (!schoolData) throw new NotFoundException('School demand not found');
    const {
      Person: person,
      SchoolDemand: {
        demand_status,
        rejection_reason,
        referral_code,
        paid_amount,
      },
      ...school
    } = schoolData;
    return new DemandDetails({
      person,
      school: {
        ...school,
        school_code,
        paid_amount,
        referral_code,
        school_demand_status: demand_status,
        school_rejection_reason: rejection_reason,
      },
    });
  }

  async findAll() {
    const schools = await this.prismaService.school.findMany({
      include: { SchoolDemand: true },
    });
    return schools.map(
      ({
        SchoolDemand: {
          demand_status,
          rejection_reason,
          paid_amount,
          referral_code,
        },
        ...school
      }) =>
        new SchoolEntity({
          ...school,
          paid_amount,
          referral_code,
          school_demand_status: demand_status,
          school_rejection_reason: rejection_reason,
        })
    );
  }

  async create({
    school: {
      school_email,
      initial_year_ends_at: ends_at,
      initial_year_starts_at: starts_at,
      school_phone_number,
      school_name,
      school_acronym,
      paid_amount,
      referral_code,
      lead_funnel,
    },
    configurator: { password, phone_number, ...person },
  }: SubmitDemandDto) {
    const academic_year_id = randomUUID();
    const annual_configurator_id = randomUUID();
    const year_code = await this.codeGenerator.getYearCode(
      starts_at.getFullYear(),
      ends_at.getFullYear()
    );
    const school_code = await this.codeGenerator.getSchoolCode(school_acronym);
    const matricule = `${school_acronym}${this.codeGenerator.formatNumber(1)}`;
    const [school] = await this.prismaService.$transaction([
      this.prismaService.school.create({
        data: {
          school_email,
          school_code,
          school_acronym,
          school_phone_number,
          school_name,
          lead_funnel,
          Person: {
            connectOrCreate: {
              create: { ...person, phone_number },
              where: { email: person.email },
            },
          },
          SchoolDemand: { create: { referral_code, paid_amount } },
        },
      }),
      this.prismaService.annualConfigurator.create({
        data: {
          matricule,
          is_sudo: true,
          annual_configurator_id,
          Login: {
            create: {
              is_personnel: true,
              password: bcrypt.hashSync(password, Number(process.env.SALT)),
              Person: {
                connectOrCreate: {
                  create: { ...person, phone_number },
                  where: { email: person.email },
                },
              },
              School: { connect: { school_code } },
            },
          },
          AcademicYear: {
            create: {
              ends_at,
              starts_at,
              year_code,
              academic_year_id,
              School: { connect: { school_code } },
            },
          },
        },
      }),
      this.prismaService.annualCarryOverSytem.create({
        data: {
          carry_over_system: CarryOverSystemEnum.SUBJECT,
          AcademicYear: { connect: { year_code } },
          AnnualConfigurator: {
            connect: { annual_configurator_id },
          },
        },
      }),
      this.prismaService.annualSemesterExamAcess.createMany({
        data: [
          {
            academic_year_id,
            payment_percentage: 0,
            annual_semester_number: 1,
            configured_by: annual_configurator_id,
          },
          {
            academic_year_id,
            payment_percentage: 0,
            annual_semester_number: 2,
            configured_by: annual_configurator_id,
          },
        ],
      }),
      this.prismaService.annualConfigurator.update({
        data: {
          CreatedByAnnualConfigurator: { connect: { annual_configurator_id } },
        },
        where: { annual_configurator_id },
      }),
    ]);
    return new SchoolEntity({
      ...school,
      paid_amount,
      referral_code,
      school_rejection_reason: null,
      school_demand_status: 'PENDING',
    });
  }

  async validateDemand(
    { school_code, rejection_reason, subdomain }: ValidateDemandDto,
    audited_by: string
  ) {
    const schoolDemand = await this.prismaService.schoolDemand.findFirst({
      where: {
        School: { school_code },
      },
    });
    if (!schoolDemand) throw new NotFoundException('School demand');
    const {
      demand_status,
      rejection_reason: reason,
      referral_code,
      paid_amount,
    } = schoolDemand;
    await this.prismaService.schoolDemand.update({
      data: {
        rejection_reason,
        demand_status: rejection_reason
          ? SchoolDemandStatus.REJECTED
          : SchoolDemandStatus.VALIDATED,
        School: {
          update: { subdomain, is_validated: true },
        },
        SchoolDemandAudits: {
          create: {
            audited_by,
            paid_amount,
            referral_code,
            demand_status,
            rejection_reason: reason,
          },
        },
      },
      where: { school_demand_id: schoolDemand.school_demand_id },
    });
  }

  async updateStatus(school_code: string, audited_by: string) {
    const schoolDemand = await this.prismaService.schoolDemand.findFirst({
      where: { School: { school_code } },
    });
    if (!schoolDemand) throw new NotFoundException('School demand');

    const { demand_status, referral_code, rejection_reason, school_demand_id } =
      schoolDemand;
    await this.prismaService.schoolDemand.update({
      data: {
        demand_status: SchoolDemandStatus.PROCESSING,
        SchoolDemandAudits: {
          create: {
            audited_by,
            referral_code,
            demand_status,
            rejection_reason,
          },
        },
      },
      where: { school_demand_id },
    });
  }
}
