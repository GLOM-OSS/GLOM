import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DemandPostData, DemandValidateDto } from './dto';
import { CodeGeneratorService } from '../../utils/code-generator';
import { randomUUID } from 'crypto';
import { SchoolDemandStatus } from '@prisma/client';
import { AUTH404 } from '../../errors';

@Injectable()
export class DemandService {
  private loginService: typeof this.prismaService.login;
  private personService: typeof this.prismaService.person;
  private schoolService: typeof this.prismaService.school;
  private loginAuditService: typeof this.prismaService.loginAudit;
  private schoolDemandService: typeof this.prismaService.schoolDemand;
  private annualConfiguratorService: typeof this.prismaService.annualConfigurator;

  constructor(
    private prismaService: PrismaService,
    private codeGenerator: CodeGeneratorService
  ) {
    this.schoolService = prismaService.school;
    this.schoolDemandService = prismaService.schoolDemand;
    this.annualConfiguratorService = this.prismaService.annualConfigurator;
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

  async addDemand({ school, personnel }: DemandPostData) {
    const { password, phone: phone_number, ...person } = personnel;
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
    const year_code = await this.codeGenerator.getYearCode(
      starts_at.getFullYear(),
      ends_at.getFullYear()
    );
    const school_code = await this.codeGenerator.getSchoolCode(school_acronym);
    const annual_configurator_id = randomUUID();
    await this.prismaService.$transaction([
      this.annualConfiguratorService.create({
        data: {
          is_sudo: true,
          annual_configurator_id,
          Login: {
            create: {
              password: bcrypt.hashSync(password, Number(process.env.SALT)),
              Person: {
                connectOrCreate: {
                  create: { ...person, phone_number },
                  where: { email: person.email },
                },
              },
            },
          },
          AcademicYear: {
            create: {
              ends_at,
              starts_at,
              year_code,
              School: {
                create: {
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
              },
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
    validated_by: string
  ) {
    const schoolDemand = await this.schoolDemandService.findFirst({
      select: { school_demand_id: true },
      where: {
        School: { school_code },
      },
    });
    if (!schoolDemand)
      throw new HttpException(
        JSON.stringify(AUTH404('SchoolDemand')),
        HttpStatus.NOT_FOUND
      );

    await this.schoolDemandService.update({
      data: rejection_reason
        ? {
            rejection_reason,
            responsed_at: new Date(),
            demand_status: SchoolDemandStatus.REJECTED,
            Login: { connect: { login_id: validated_by } },
          }
        : {
            responsed_at: new Date(),
            demand_status: SchoolDemandStatus.VALIDATED,
            Login: { connect: { login_id: validated_by } },
            School: {
              update: {
                subdomain: `${subdomain}.squoolr.com`,
                is_validated: true,
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
}
