import { NotchPayService } from '@glom/payment';
import { GlomPrismaService } from '@glom/prisma';
import { excludeKeys } from '@glom/utils';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SchoolDemandStatus } from '@prisma/client';
import { AxiosError } from 'axios';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { CodeGeneratorFactory } from '../../helpers/code-generator.factory';
import { AcademicYearArgsFactory } from '../academic-years/academic-year-args.factory';
import { SchoolArgsFactory } from './school-args.factory';
import {
  QuerySchoolDto,
  SchoolDemandDetails,
  SchoolSettingEntity,
  SubmitSchoolDemandDto,
  UpdateSchoolDto,
  UpdateSchoolSettingDto,
  ValidateSchoolDemandDto,
} from './schools.dto';

@Injectable()
export class SchoolsService {
  constructor(
    private prismaService: GlomPrismaService,
    private notchPayService: NotchPayService,
    private codeGenerator: CodeGeneratorFactory
  ) {}

  async findOne(identifier: string) {
    const school = await this.prismaService.school.findFirstOrThrow({
      ...SchoolArgsFactory.getSchoolSelect(),
      where: { OR: [{ school_id: identifier }, { school_code: identifier }] },
    });
    return SchoolArgsFactory.getSchoolEntity(school);
  }

  async findDetails(school_id: string) {
    const { include: includeArgs } = SchoolArgsFactory.getSchoolSelect();
    const schoolData = await this.prismaService.school.findUnique({
      include: {
        ...includeArgs,
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
      school: SchoolArgsFactory.getSchoolEntity(school),
    });
  }

  async findAll(params?: QuerySchoolDto) {
    const schools = await this.prismaService.school.findMany({
      ...SchoolArgsFactory.getSchoolSelect(),
      where: {
        is_deleted: params?.is_deleted ?? false,
        school_name: params?.keywords
          ? { search: params?.keywords }
          : undefined,
        SchoolDemand: params?.schoolDemandStatus
          ? { demand_status: { in: params?.schoolDemandStatus } }
          : undefined,
      },
    });
    return schools.map((school) => SchoolArgsFactory.getSchoolEntity(school));
  }

  private async verifyPayment(payment_id: string) {
    const payment = await this.prismaService.payment.findUniqueOrThrow({
      where: { payment_id },
    });
    return this.notchPayService.verifyPayment(payment.payment_ref);
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
    } = await this.getFistYearSetup(demandpayload);

    if (payment_id) {
      const payment = await this.verifyPayment(payment_id);
      if (payment.status !== 'complete')
        throw new UnprocessableEntityException('Payment was not completed');
    }
    const [school] = await this.prismaService.$transaction([
      this.prismaService.school.create({
        ...SchoolArgsFactory.getSchoolSelect(),
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
    return SchoolArgsFactory.getSchoolEntity(school);
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
    school_demand_status: SchoolDemandStatus,
    audited_by: string
  ) {
    const schoolDemand = await this.prismaService.schoolDemand.findFirst({
      where: { School: { school_id } },
    });
    if (!schoolDemand) throw new NotFoundException('School demand');

    const { demand_status, ambassador_id, rejection_reason } = schoolDemand;
    if (
      (demand_status === 'VALIDATED' && school_demand_status !== 'SUSPENDED') ||
      (demand_status === 'PENDING' && school_demand_status === 'PROCESSING')
    )
      await this.prismaService.schoolDemand.update({
        data: {
          demand_status: school_demand_status,
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
    else
      throw new BadRequestException(
        `Cannot change status from '${demand_status}' to ${school_demand_status}`
      );
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
              'school_id',
              'school_code',
            ]),
            AuditedBy: { connect: { annual_configurator_id: audited_by } },
          },
        },
      },
      where: { school_id },
    });
  }

  async updateSettings(
    academic_year_id: string,
    {
      can_pay_fee,
      mark_insertion_source,
      deletedSignerIds,
      newDocumentSigners,
    }: UpdateSchoolSettingDto,
    audited_by: string
  ) {
    const schoolSetting =
      await this.prismaService.annualSchoolSetting.findFirst({
        select: { can_pay_fee: true, mark_insertion_source: true },
        where: { academic_year_id },
      });
    await this.prismaService.annualSchoolSetting.update({
      data: {
        can_pay_fee,
        mark_insertion_source,
        AnnualSchoolSettingAudits: {
          create: {
            ...schoolSetting,
            AuditedBy: { connect: { annual_configurator_id: audited_by } },
          },
        },
        AnnualDocumentSigners: {
          createMany: {
            data: newDocumentSigners.map((signer) => ({
              ...signer,
              created_by: audited_by,
            })),
            skipDuplicates: true,
          },
          updateMany:
            deletedSignerIds && deletedSignerIds.length > 0
              ? {
                  data: { is_deleted: true },
                  where: {
                    annual_document_signer_id: { in: deletedSignerIds },
                  },
                }
              : undefined,
        },
      },
      where: { academic_year_id },
    });
  }

  async getSettings(academic_year_id: string) {
    const { AnnualDocumentSigners: documentSigners, ...schoolSetting } =
      await this.prismaService.annualSchoolSetting.findUniqueOrThrow({
        include: { AnnualDocumentSigners: { where: { is_deleted: false } } },
        where: { academic_year_id },
      });
    return new SchoolSettingEntity({ ...schoolSetting, documentSigners });
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
              },
            },
          },
        }),
        this.prismaService.academicYear.update({
          data: AcademicYearArgsFactory.getInitialSetup(annual_configurator_id),
          where: { academic_year_id },
        }),
      ],
    };
  }
}
