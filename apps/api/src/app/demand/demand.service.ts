import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DemandPostData, ValidateDemandDto } from './dto';
import { CodeGeneratorService } from '../../utils/code-generator';
import { randomUUID } from 'crypto';

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

  async getDemands() {
    const schools = await this.schoolService.findMany();
    console.log(schools);
    return [{ demad: 'AICS Demand' }];
  }

  async addSchoolDemand({ school, personnel }: DemandPostData) {
    const { password, phone: phone_number, ...person } = personnel;
    const {
      email,
      initial_year_ends_at,
      initial_year_starts_at,
      phone,
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
    return this.prismaService.$transaction([
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
                  email,
                  school_code,
                  school_acronym,
                  phone_number: phone,
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
  }

  async validateDemand(
    { school_demand_id, rejection_reason, subdomain }: ValidateDemandDto,
    validated_by: string
  ) {
    await this.schoolDemandService.update({
      data: rejection_reason
        ? {
            rejection_reason,
            responsed_at: new Date(),
            Login: { connect: { login_id: validated_by } },
          }
        : {
            responsed_at: new Date(),
            Login: { connect: { login_id: validated_by } },
            School: { update: { subdomain, is_validated: true} },
          },
      where: { school_demand_id },
    });
  }
}
