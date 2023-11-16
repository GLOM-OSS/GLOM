import { NotchPayService } from '@glom/payment';
import { GlomPrismaService } from '@glom/prisma';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  CarryOverSystemEnum,
  Prisma,
  SchoolDemandStatus,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { CodeGeneratorFactory } from '../../helpers/code-generator.factory';
import {
  SchoolDemandDetails,
  SchoolEntity,
  SubmitSchoolDemandDto,
  UpdateSchoolDemandStatus,
  UpdateSchoolDto,
  UpdateSchoolSettingDto,
  ValidateSchoolDemandDto,
} from './schools.dto';
import { AxiosError } from 'axios';
import { excludeKeys } from '@glom/utils';

const schoolSelectAttr = Prisma.validator<Prisma.SchoolArgs>()({
  include: {
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
export class SchoolsService {
  constructor(
    private prismaService: GlomPrismaService,
    private notchPayService: NotchPayService,
    private codeGenerator: CodeGeneratorFactory
  ) {}

  async findOne(identifier: string) {
    const school = await this.prismaService.school.findFirstOrThrow({
      ...schoolSelectAttr,
      where: { OR: [{ school_id: identifier }, { school_code: identifier }] },
    });
    return getSchoolEntity(school);
  }

  async findDetails(school_id: string) {
    const schoolData = await this.prismaService.school.findUnique({
      include: {
        ...schoolSelectAttr.include,
        CreatedBy: true,
        AcademicYears: {
          take: 1,
          orderBy: { created_at: 'asc' },
        },
      },
      where: { school_id },
    });
    if (!schoolData) throw new NotFoundException('School demand not found');
    const {
      CreatedBy: person,
      AcademicYears: [academicYear],
      ...school
    } = schoolData;
    return new SchoolDemandDetails({
      person,
      academicYear: {
        ends_at: academicYear?.ended_at,
        starts_at: academicYear?.starts_at,
      },
      school: getSchoolEntity(school),
    });
  }

  async findAll() {
    const schools = await this.prismaService.school.findMany({
      ...schoolSelectAttr,
    });
    return schools.map((school) => getSchoolEntity(school));
  }

  async create(demandpayload: SubmitSchoolDemandDto) {
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
    } = await this.getFistYearSetup(demandpayload);

    let payment_ref: string;
    let onboarding_fee: number;
    if (payment_phone) {
      const payment = await this.payOnboardingFee(payment_phone).catch(
        (error: AxiosError) => {
          throw new UnprocessableEntityException(
            `Payment failed for: ${
              error.response.data['message'] || error.message
            }`
          );
        }
      );
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
          CreatedBy: {
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

  async validate(
    school_id: string,
    { rejection_reason, subdomain }: ValidateSchoolDemandDto,
    audited_by: string
  ) {
    const schoolDemand = await this.prismaService.schoolDemand.findFirstOrThrow(
      {
        where: {
          School: { school_id },
        },
      }
    );
    const {
      demand_status,
      ambassador_id,
      rejection_reason: reason,
    } = schoolDemand;
    await this.prismaService.schoolDemand.update({
      data: {
        rejection_reason,
        demand_status: rejection_reason
          ? SchoolDemandStatus.REJECTED
          : SchoolDemandStatus.VALIDATED,
        School: {
          update: {
            subdomain,
            is_validated: true,
            validated_at: new Date(),
            ValidatedBy: { connect: { login_id: audited_by } },
          },
        },
        SchoolDemandAudits: {
          create: {
            audited_by,
            ambassador_id,
            demand_status,
            rejection_reason: reason,
          },
        },
      },
      where: { school_demand_id: schoolDemand.school_demand_id },
    });
  }

  async updateStatus(
    school_id: string,
    payload: UpdateSchoolDemandStatus,
    audited_by: string
  ) {
    const schoolDemand = await this.prismaService.schoolDemand.findFirst({
      where: { School: { school_id } },
    });
    if (!schoolDemand) throw new NotFoundException('School demand');

    const { demand_status, ambassador_id, rejection_reason } = schoolDemand;
    await this.prismaService.schoolDemand.update({
      data: {
        demand_status: payload.school_demand_status,
        SchoolDemandAudits: {
          create: {
            audited_by,
            ambassador_id,
            demand_status,
            rejection_reason,
          },
        },
      },
      where: { school_id },
    });
  }

  async update(
    school_id: string,
    payload: UpdateSchoolDto,
    audited_by: string
  ) {
    const school = await this.prismaService.school.findUniqueOrThrow({
      where: { school_id },
    });
    return this.prismaService.school.update({
      data: {
        ...payload,
        SchoolAudits: {
          create: {
            ...excludeKeys(school, [
              'lead_funnel',
              'subdomain',
              'created_at',
              'created_by',
            ]),
            AuditedBy: { connect: { annual_configurator_id: audited_by } },
          },
        },
      },
      where: { school_id },
    });
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

  private async getFistYearSetup({
    school: {
      school_acronym,
      initial_year_ends_at: ends_at,
      initial_year_starts_at: starts_at,
    },
    configurator: { password, phone_number, ...person },
  }: SubmitSchoolDemandDto) {
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
                AnnualSchoolSetting: {
                  create: {
                    mask_management: 'Teacher',
                    CreatedBy: { connect: { annual_configurator_id } },
                  },
                },
              },
            },
          },
        }),
        this.prismaService.annualCarryOverSytem.create({
          data: {
            carry_over_system: CarryOverSystemEnum.SUBJECT,
            AcademicYear: { connect: { year_code } },
            CreatedBy: {
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
              created_by: annual_configurator_id,
            },
            {
              academic_year_id,
              payment_percentage: 0,
              annual_semester_number: 2,
              created_by: annual_configurator_id,
            },
          ],
        }),
      ],
    };
  }
}
