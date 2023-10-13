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
import { PersonEntity } from '../auth/auth.dto';

@Injectable()
export class DemandService {
  readonly queryAttrs = Prisma.validator<Prisma.SchoolSelect>()({
    SchoolDemand: { select: { demand_status: true, rejection_reason: true } },
  });

  constructor(
    private prismaService: GlomPrismaService,
    private codeGenerator: CodeGeneratorFactory
  ) {}

  async findOne(school_code: string) {
    const school = await this.prismaService.school.findUnique({
      include: this.queryAttrs,
      where: { school_code },
    });
    if (!school) throw new NotFoundException('School demand not found');
    const {
      SchoolDemand: { demand_status, rejection_reason },
    } = school;
    return new SchoolEntity({
      ...school,
      school_demand_status: demand_status,
      school_rejection_reason: rejection_reason,
    });
  }

  async findDetails(school_code: string) {
    const schoolData = await this.prismaService.school.findUnique({
      include: { ...this.queryAttrs, Person: true },
      where: { school_code },
    });
    if (!schoolData) throw new NotFoundException('School demand not found');
    const {
      Person: person,
      SchoolDemand: { demand_status, rejection_reason },
      ...school
    } = schoolData;
    return new DemandDetails({
      person,
      school: {
        ...school,
        school_code,
        school_demand_status: demand_status,
        school_rejection_reason: rejection_reason,
      },
    });
  }

  async findAll() {
    const schools = await this.prismaService.school.findMany({
      include: this.queryAttrs,
    });
    return schools.map(
      ({ SchoolDemand: { demand_status, rejection_reason }, ...school }) =>
        new SchoolEntity({
          ...school,
          school_demand_status: demand_status,
          school_rejection_reason: rejection_reason,
        })
    );
  }

  async create({
    school: {
      school_email,
      initial_year_ends_at,
      initial_year_starts_at,
      school_phone_number,
      school_name,
      school_acronym,
    },
    personnel: { password, phone_number, ...person },
  }: SubmitDemandDto) {
    const academic_year_id = randomUUID();
    const annual_configurator_id = randomUUID();
    const ends_at = new Date(initial_year_ends_at);
    const starts_at = new Date(initial_year_starts_at);
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
          Person: {
            connectOrCreate: {
              create: { ...person, phone_number },
              where: { email: person.email },
            },
          },
          SchoolDemand: { create: {} },
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
      school_rejection_reason: null,
      school_demand_status: 'PENDING',
    });
  }

  async validateDemand(
    { school_code, rejection_reason, subdomain }: ValidateDemandDto,
    audited_by: string
  ) {
    const schoolDemand = await this.prismaService.schoolDemand.findFirst({
      select: {
        school_demand_id: true,
        demand_status: true,
        rejection_reason: true,
      },
      where: {
        School: { school_code },
      },
    });
    if (!schoolDemand) throw new NotFoundException('School demand');

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
            rejection_reason: schoolDemand.rejection_reason,
            demand_status: schoolDemand.demand_status,
            audited_by,
          },
        },
      },
      where: { school_demand_id: schoolDemand.school_demand_id },
    });
  }

  async updateStatus(school_code: string, audited_by: string) {
    const demand = await this.prismaService.schoolDemand.findFirst({
      select: {
        school_demand_id: true,
        demand_status: true,
        rejection_reason: true,
      },
      where: { School: { school_code } },
    });
    if (!demand) throw new NotFoundException('School demand');

    const { demand_status, rejection_reason } = demand;
    await this.prismaService.schoolDemand.update({
      data: {
        demand_status: SchoolDemandStatus.PROCESSING,
        SchoolDemandAudits: {
          create: {
            demand_status,
            rejection_reason,
            audited_by,
          },
        },
      },
      where: { school_demand_id: demand.school_demand_id },
    });
  }
}
