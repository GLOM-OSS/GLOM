import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AUTH404 } from '../../../errors';
import { PrismaService } from '../../../prisma/prisma.service';
import { CodeGeneratorService } from '../../../utils/code-generator';
import {
  AnnualMajorPutDto,
  MajorPostDto,
  MajorQueryDto,
} from '../configurator.dto';

@Injectable()
export class MajorService {
  private annualMajorService: typeof this.prismaService.annualMajor;
  private departmentService: typeof this.prismaService.department;

  constructor(
    private prismaService: PrismaService,
    private codeGenerator: CodeGeneratorService
  ) {
    this.departmentService = prismaService.department;
    this.annualMajorService = prismaService.annualMajor;
  }

  async findAll({ archived, ...where }: MajorQueryDto) {
    const annualMajors = await this.annualMajorService.findMany({
      select: {
        major_acronym: true,
        major_code: true,
        major_name: true,
        Major: {
          select: {
            Cycle: {
              select: { cycle_name: true },
            },
          },
        },
      },
      where: { ...where, is_deleted: archived },
    });

    return annualMajors.map(
      ({
        Major: {
          Cycle: { cycle_name },
        },
        ...major
      }) => ({ cycle_name, ...major })
    );
  }

  async addNewMajor(
    { department_code, major_acronym, major_name, cycle_id }: MajorPostDto,
    academic_year_id: string,
    annual_configurator_id: string
  ) {
    const major = await this.annualMajorService.findFirst({
      where: { major_acronym, Department: { department_code } },
    });
    const major_code =
      major?.major_code ??
      (await this.codeGenerator.getMajorCode(major_acronym, department_code));

    return this.annualMajorService.upsert({
      create: {
        major_name,
        major_acronym,
        major_code,
        Major: {
          connectOrCreate: {
            create: {
              major_acronym,
              major_code,
              major_name,
              Cycle: { connect: { cycle_id } },
              AnnualConfigurator: { connect: { annual_configurator_id } },
            },
            where: { major_code },
          },
        },
        Department: { connect: { department_code } },
        AcademicYear: { connect: { academic_year_id } },
        AnnualConfigurator: { connect: { annual_configurator_id } },
      },
      update: {},
      where: {
        major_code_academic_year_id: {
          academic_year_id,
          major_code,
        },
      },
    });
  }

  async editMajor(
    major_code: string,
    data: AnnualMajorPutDto,
    academic_year_id: string,
    annual_configurator_id: string
  ) {
    const { major_acronym, major_name, department_code } = data;

    const annualMajorAudit = await this.annualMajorService.findFirst({
      select: {
        annual_major_id: true,
        major_acronym: true,
        major_code: true,
        major_name: true,
        is_deleted: true,
        department_id: true,
        Department: { select: { department_code: true } },
        Major: { select: { cycle_id: true } },
      },
      where: {
        academic_year_id,
        Major: { major_code },
      },
    });
    if (!annualMajorAudit)
      throw new HttpException(AUTH404('Major')['Fr'], HttpStatus.NOT_FOUND);

    const { annual_major_id, Major, Department, ...majorAudit } =
      annualMajorAudit;
    let updateInput: Prisma.AnnualMajorUpdateInput = {
      major_name,
      AnnualMajorAudits: {
        create: {
          ...majorAudit,
          audited_by: annual_configurator_id,
        },
      },
    };
    if (
      major_acronym !== annualMajorAudit.major_acronym ||
      department_code !== Department.department_code
    ) {
      const newMajorCode = await this.codeGenerator.getMajorCode(
        major_acronym,
        department_code
      );
      updateInput = {
        major_name,
        major_acronym,
        major_code: newMajorCode,
        Department: { connect: { department_code } },
        Major: {
          connectOrCreate: {
            create: {
              major_acronym,
              major_name,
              major_code: newMajorCode,
              Cycle: {
                connect: { cycle_id: Major.cycle_id },
              },
              AnnualConfigurator: { connect: { annual_configurator_id } },
            },
            where: { major_code: newMajorCode },
          },
        },
      };
    }
    return this.annualMajorService.update({
      data: updateInput,
      where: { annual_major_id },
    });
  }
}
