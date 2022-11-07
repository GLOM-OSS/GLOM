import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SchoolDemandStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { AUTH404 } from '../../errors';
import { PrismaService } from '../../prisma/prisma.service';
import { CodeGeneratorService } from '../../utils/code-generator';
import { DemandPostDto, DemandValidateDto } from './demand.dto';

@Injectable()
export class DemandService {
  private loginService: typeof this.prismaService.login;
  private schoolService: typeof this.prismaService.school;
  private schoolDemandService: typeof this.prismaService.schoolDemand;
  private annualConfiguratorService: typeof this.prismaService.annualConfigurator;

  constructor(
    private prismaService: PrismaService,
    private codeGenerator: CodeGeneratorService
  ) {
    this.loginService = prismaService.login;
    this.schoolService = prismaService.school;
    this.schoolDemandService = prismaService.schoolDemand;
    this.annualConfiguratorService = prismaService.annualConfigurator;
  }

  async findOne(school_code: string) {
    const schoolData = await this.schoolService.findFirst({
      select: {
        school_name: true,
        school_email: true,
        school_phone_number: true,
        Person: true,
        SchoolDemand: { select: { demand_status: true } },
      },
      where: { school_code },
    });
    if (schoolData) {
      const {
        Person: person,
        SchoolDemand: { demand_status },
        ...school
      } = schoolData;
      return { school: { ...school, demand_status }, person };
    }
  }

  async findAll() {
    const schools = await this.schoolService.findMany({
      select: {
        school_email: true,
        school_code: true,
        school_name: true,
        school_phone_number: true,
        SchoolDemand: {
          select: { demand_status: true },
        },
      },
    });
    return schools.map(({ SchoolDemand: { demand_status }, ...school }) => ({
      demand_status,
      ...school,
    }));
  }

  async addDemand({ school, personnel }: DemandPostDto) {
    const { password, phone_number, ...person } = personnel;
    const {
      school_email,
      initial_year_ends_at,
      initial_year_starts_at,
      school_phone_number,
      school_name,
      school_acronym,
    } = school;

    const ends_at = new Date(initial_year_ends_at);
    const starts_at = new Date(initial_year_starts_at);
    const year_code = `YEAR-${ends_at.getFullYear()}${starts_at.getFullYear()}${this.codeGenerator.getNumberString(
      1
    )}`;
    const school_code = await this.codeGenerator.getSchoolCode(school_acronym);
    const annual_configurator_id = randomUUID();
    const matricule = `${school_acronym}${this.codeGenerator.getNumberString(
      1
    )}`;
    await this.prismaService.$transaction([
      this.schoolService.create({
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
      this.annualConfiguratorService.create({
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
              School: { connect: { school_code } },
            },
          },
        },
      }),
      this.annualConfiguratorService.update({
        data: { AnnualConfigurator: { connect: { annual_configurator_id } } },
        where: { annual_configurator_id },
      }),
    ]);
    return school_code;
  }

  async validateDemand(
    { school_code, rejection_reason, subdomain }: DemandValidateDto,
    audited_by: string
  ) {
    const schoolDemand = await this.schoolDemandService.findFirst({
      select: {
        school_demand_id: true,
        demand_status: true,
        rejection_reason: true,
      },
      where: {
        School: { school_code },
      },
    });
    if (!schoolDemand)
      throw new HttpException(
        JSON.stringify(AUTH404('School demand')),
        HttpStatus.NOT_FOUND
      );

    await this.schoolDemandService.update({
      data: {
        rejection_reason,
        demand_status: rejection_reason
          ? SchoolDemandStatus.REJECTED
          : SchoolDemandStatus.VALIDATED,
        School: {
          update: { subdomain },
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

  async getStatus(school_demand_code: string) {
    const school = await this.schoolService.findUnique({
      select: {
        subdomain: true,
        SchoolDemand: {
          select: { demand_status: true, rejection_reason: true },
        },
      },
      where: { school_code: school_demand_code },
    });
    if (school) {
      const {
        subdomain,
        SchoolDemand: { demand_status: school_status, rejection_reason },
      } = school;
      return { subdomain, school_status, rejection_reason };
    }
    return null;
  }

  async editDemandStatus(school_code: string, audited_by: string) {
    const demand = await this.schoolDemandService.findFirst({
      select: {
        school_demand_id: true,
        demand_status: true,
        rejection_reason: true,
      },
      where: { School: { school_code } },
    });
    if (!demand)
      throw new HttpException(
        JSON.stringify(AUTH404('School demand')),
        HttpStatus.NOT_FOUND
      );

    const { demand_status, rejection_reason } = demand;
    await this.schoolDemandService.update({
      data: {
        demand_status: SchoolDemandStatus.PROGRESS,
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
