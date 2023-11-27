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
  ValidateSchoolDemandDto,
} from './schools.dto';
import { QueryParams } from '../module';

const schoolSelectAttr = Prisma.validator<Prisma.SchoolArgs>()({
  select: {
    school_id: true,
    school_acronym: true,
    school_code: true,
    lead_funnel: true,
    school_email: true,
    school_name: true,
    subdomain: true,
    school_phone_number: true,
    created_at: true,
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
    // if (!school) throw new NotFoundException('School demand not found');
    return getSchoolEntity(school);
  }

  async findDetails(school_id: string) {
    const schoolData = await this.prismaService.school.findUnique({
      select: {
        ...schoolSelectAttr.select,
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

  async findAll(params?: QueryParams) {
    const schools = await this.prismaService.school.findMany({
      ...schoolSelectAttr,
      where: {
        is_deleted: params?.is_deleted,
        school_name: params ? { search: params?.keywords } : undefined,
      },
    });
    return schools.map((school) => getSchoolEntity(school));
  }

  private async verifyPayment(payment_id: string) {
    const payment = await this.prismaService.payment.findUniqueOrThrow({
      where: { payment_id },
    });
    return this.notchPayService.verifyPayment(payment.payment_ref);
  }

  private async getFistAcademicYearSetup({
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

  async create(demandpayload: SubmitSchoolDemandDto) {
    const {
      payment_id,
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

    if (payment_id) {
      const payment = await this.verifyPayment(payment_id);
      if (payment.status !== 'complete')
        throw new UnprocessableEntityException('Payment was not completed');
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
              ...(payment_id
                ? {
                    Payment: {
                      connect: { payment_id },
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
    school_id: string,
    { rejection_reason, subdomain }: ValidateSchoolDemandDto,
    audited_by: string
  ) {
    const schoolDemand = await this.prismaService.schoolDemand.findFirst({
      include: { Payment: true },
      where: {
        School: { school_id },
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
}
