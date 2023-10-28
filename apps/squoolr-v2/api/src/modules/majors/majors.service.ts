import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { CodeGeneratorFactory } from '../../helpers/code-generator.factory';
import {
  CreateMajorPayload,
  GenerateClassroomsPayload,
  UpdateMajorPayload,
} from './major';
import { AnnualMajorEntity, QueryMajorDto, UpdateMajorDto } from './major.dto';

export const annualMajorSelect = Prisma.validator<Prisma.AnnualMajorSelect>()({
  annual_major_id: true,
  major_name: true,
  major_code: true,
  major_acronym: true,
  major_id: true,
  Major: {
    select: { Cycle: { select: { cycle_id: true, cycle_name: true } } },
  },
  Department: {
    select: { department_id: true, department_acronym: true },
  },
});

@Injectable()
export class MajorsService {
  constructor(
    private prismaService: GlomPrismaService,
    private codeGenerator: CodeGeneratorFactory
  ) {}

  async findAll(academic_year_id: string, params?: QueryMajorDto) {
    const annualMajors = await this.prismaService.annualMajor.findMany({
      select: annualMajorSelect,
      where: {
        academic_year_id,
        OR: params
          ? [
              {
                is_deleted: params.is_deleted,
                department_id: params.department_id,
              },
              {
                major_name: {
                  search: params.keywords,
                },
              },
            ]
          : undefined,
      },
    });

    return annualMajors.map(
      ({ Major: { Cycle: cycle }, Department: department, ...major }) =>
        new AnnualMajorEntity({ ...major, ...cycle, ...department })
    );
  }

  async findOne(annual_major_id: string) {
    const {
      Major: { Cycle: cycle },
      Department: department,
      ...major
    } = await this.prismaService.annualMajor.findUniqueOrThrow({
      select: annualMajorSelect,
      where: { annual_major_id },
    });
    return new AnnualMajorEntity({ ...major, ...cycle, ...department });
  }

  async create(
    {
      cycle_id,
      major_name,
      major_acronym,
      department_id,
      academic_year_id,
    }: CreateMajorPayload,
    created_by: string
  ) {
    const [cycle, major] = await Promise.all([
      this.prismaService.cycle.findUniqueOrThrow({
        where: { cycle_id },
      }),
      this.prismaService.major.findFirst({
        where: {
          major_acronym,
          cycle_id,
        },
      }),
    ]);
    const major_code =
      major?.major_code ??
      (await this.codeGenerator.getMajorCode(major_acronym, department_id));
    const annualMajorId = randomUUID();
    const { classrooms, annualClassrooms, annualClassroomDivisions } =
      await this.generateClassrooms(
        {
          major_name,
          major_acronym,
          annual_major_id: annualMajorId,
          number_of_years: cycle.number_of_years,
        },
        created_by
      );

    const [
      {
        Major: { Cycle: majorCycle },
        Department: department,
        ...newAnnualMajor
      },
    ] = await this.prismaService.$transaction([
      this.prismaService.annualMajor.create({
        include: {
          Department: { select: { department_acronym: true } },
          Major: {
            select: { Cycle: { select: { cycle_id: true, cycle_name: true } } },
          },
        },
        data: {
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
                AnnualConfigurator: {
                  connect: { annual_configurator_id: created_by },
                },
                Classrooms: {
                  createMany: {
                    data: classrooms,
                  },
                },
              },
              where: { major_code },
            },
          },
          Department: { connect: { department_id } },
          AcademicYear: { connect: { academic_year_id } },
          AnnualConfigurator: {
            connect: { annual_configurator_id: created_by },
          },
        },
      }),
      this.prismaService.annualClassroom.createMany({
        data: annualClassrooms,
      }),
      this.prismaService.annualClassroomDivision.createMany({
        data: annualClassroomDivisions,
      }),
    ]);
    return new AnnualMajorEntity({
      ...majorCycle,
      ...department,
      ...newAnnualMajor,
    });
  }

  private async generateClassrooms(
    {
      major_name,
      major_acronym,
      number_of_years,
      annual_major_id,
    }: GenerateClassroomsPayload,
    created_by: string
  ) {
    const classrooms: Prisma.ClassroomCreateManyMajorInput[] = [];
    const annualClassrooms: Prisma.AnnualClassroomCreateManyInput[] = [];
    const annualClassroomDivisions: Prisma.AnnualClassroomDivisionCreateManyInput[] =
      [];
    await Promise.all(
      [...new Array(number_of_years)].map(async (_, i) => {
        const level = i + 1;
        const classroom_acronym = `${major_acronym}${level}`;
        const count = await this.prismaService.classroom.count({
          where: { level, classroom_acronym },
        });
        const classroom = {
          classroom_id: randomUUID(),
          classroom_acronym,
          classroom_code: `${classroom_acronym}${this.codeGenerator.formatNumber(
            count + 1
          )}`,
          classroom_name: `${major_name} ${level}`,
        };
        classrooms.push({
          level,
          created_by,
          ...classroom,
        });
        const annual_classroom_id = randomUUID();
        annualClassrooms.push({
          ...classroom,
          annual_major_id,
          annual_classroom_id,
        });
        annualClassroomDivisions.push({
          division_letter: 'A',
          annual_classroom_id,
          created_by,
        });
      })
    );
    return {
      classrooms,
      annualClassrooms,
      annualClassroomDivisions,
    };
  }

  async update(
    annual_major_id: string,
    payload: UpdateMajorPayload,
    audited_by: string
  ) {
    const annualMajorAudit =
      await this.prismaService.annualMajor.findFirstOrThrow({
        select: {
          annual_major_id: true,
          major_acronym: true,
          major_code: true,
          major_name: true,
          is_deleted: true,
        },
        where: { annual_major_id },
      });
    await this.prismaService.annualMajor.update({
      data: {
        ...payload,
        AnnualMajorAudits: {
          create: {
            audited_by,
            ...annualMajorAudit,
          },
        },
      },
      where: { annual_major_id },
    });
  }
}
