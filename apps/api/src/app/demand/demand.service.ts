import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DemandPostData } from './dto';

@Injectable()
export class DemandService {
  private loginService: typeof this.prismaService.login;
  private personService: typeof this.prismaService.person;
  private schoolService: typeof this.prismaService.school;
  private loginAuditService: typeof this.prismaService.loginAudit;
  private schoolDemandService: typeof this.prismaService.schoolDemand;
  private annualConfiguratorService: typeof this.prismaService.annualConfigurator;

  constructor(private prismaService: PrismaService) {
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
    } = school;

    return this.annualConfiguratorService.create({
      data: {
        is_sudo: true,
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
            code: ``,
            ends_at: new Date(initial_year_ends_at),
            starts_at: new Date(initial_year_starts_at),
            School: {
              create: {
                email,
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
    });
  }
}
