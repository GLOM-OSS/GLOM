import { NotchPayService } from '@glom/payment';
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

const schoolSelectAttr = Prisma.validator<Prisma.SchoolArgs>()({
  select: {
    created_at: true,
    lead_funnel: true,
    school_acronym: true,
    school_code: true,
    school_email: true,
    school_name: true,
    school_phone_number: true,
    subdomain: true,
    SchoolDemand: {
      include: {
        Payment: true,
        Ambassador: {
          select: {
            Login: {
              select: {
                Person: { select: { email: true } },
              },
            },
          },
        },
      },
    },
  },
});
const getSchoolEntity = (
  data: Prisma.SchoolGetPayload<typeof schoolSelectAttr>
) => {
  const {
    SchoolDemand: {
      demand_status,
      rejection_reason,
      Payment: { amount: paid_amount },
      Ambassador,
    },
    ...school
  } = data;
  return new SchoolEntity({
    ...school,
    paid_amount,
    school_demand_status: demand_status,
    school_rejection_reason: rejection_reason,
    ambassador_email: Ambassador?.Login.Person.email,
  });
};

@Injectable()
export class DemandService {
  constructor(
    private prismaService: GlomPrismaService,
    private notchPayService: NotchPayService,
    private codeGenerator: CodeGeneratorFactory
  ) {}

  async findOne(school_code: string) {
    const school = await this.prismaService.school.findUnique({
      ...schoolSelectAttr,
      where: { school_code },
    });
    if (!school) throw new NotFoundException('School demand not found');
    return getSchoolEntity(school);
  }

  async findDetails(school_code: string) {
    const schoolData = await this.prismaService.school.findUnique({
      include: { ...schoolSelectAttr.select, Person: true },
      where: { school_code },
    });
    if (!schoolData) throw new NotFoundException('School demand not found');
    const { Person: person, ...school } = schoolData;
    return new DemandDetails({
      person,
      school: getSchoolEntity(school),
    });
  }

  async findAll() {
    const schools = await this.prismaService.school.findMany({
      ...schoolSelectAttr,
    });
    return schools.map((school) => getSchoolEntity(school));
  }

  private async payOnboardingFee(phone: string) {
    const settings =
      await this.prismaService.platformSettings.findFirstOrThrow();
    const newPayment = await this.notchPayService.initiatePayment({
      amount: settings.onboarding_fee,
      phone,
    });
    await this.notchPayService.completePayment(newPayment.reference, {
      channel: 'cm.mobile',
      phone,
    });
    return newPayment;
  }

  private async getFistAcademicYearSetup({
    school: {
      school_acronym,
      initial_year_ends_at: ends_at,
      initial_year_starts_at: starts_at,
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
    const configuratorCode = `${school_acronym}SE${this.codeGenerator.formatNumber(
      1
    )}`;
    return {
      data: {
        academic_year_id,
        annual_configurator_id,
        year_code,
        school_code,
      },
      transactions: [
        this.prismaService.annualConfigurator.create({
          data: {
            is_sudo: true,
            annual_configurator_id,
            matricule: configuratorCode,
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
      ],
    };
  }

  async create(demandpayload: SubmitDemandDto) {
    const {
      payment_phone,
      school: {
        school_email,
        school_phone_number,
        school_name,
        school_acronym,
        referral_code,
        lead_funnel,
      },
      configurator: { password, phone_number, ...person },
    } = demandpayload;

    const {
      transactions: academicYearSetupTransactions,
      data: { school_code },
    } = await this.getFistAcademicYearSetup(demandpayload);

    let payment_ref: string;
    let onboarding_fee: number;
    if (payment_phone) {
      const payment = await this.payOnboardingFee(payment_phone);
      payment_ref = payment.reference;
      onboarding_fee = payment.amount;
    }
    const [school] = await this.prismaService.$transaction([
      this.prismaService.school.create({
        ...schoolSelectAttr,
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
          SchoolDemand: {
            create: {
              ...(payment_phone
                ? {
                    Payment: {
                      create: {
                        payment_ref,
                        provider: 'NotchPay',
                        amount: onboarding_fee,
                        payment_reason: 'Onboarding',
                      },
                    },
                  }
                : { Ambassador: { connect: { referral_code } } }),
            },
          },
        },
      }),
      ...academicYearSetupTransactions,
    ]);
    return getSchoolEntity(school);
  }

  async validateDemand(
    school_code: string,
    { rejection_reason, subdomain }: ValidateDemandDto,
    audited_by: string
  ) {
    const schoolDemand = await this.prismaService.schoolDemand.findFirst({
      include: { Payment: true },
      where: {
        School: { school_code },
      },
    });
    if (!schoolDemand) throw new NotFoundException('School demand');
    const {
      demand_status,
      rejection_reason: reason,
      ambassador_id,
      Payment: { amount: paid_amount },
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
            ambassador_id,
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

    const { demand_status, ambassador_id, rejection_reason, school_demand_id } =
      schoolDemand;
    await this.prismaService.schoolDemand.update({
      data: {
        demand_status: SchoolDemandStatus.PROCESSING,
        SchoolDemandAudits: {
          create: {
            audited_by,
            ambassador_id,
            demand_status,
            rejection_reason,
          },
        },
      },
      where: { school_demand_id },
    });
  }
}