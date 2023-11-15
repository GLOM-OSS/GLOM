import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { CodeGeneratorFactory } from '../../helpers/code-generator.factory';
import { CreateMajorPayload, UpdateMajorPayload } from './major';
import { AnnualMajorEntity, QueryMajorDto } from './major.dto';

export const annualMajorSelect = Prisma.validator<Prisma.AnnualMajorSelect>()({
  annual_major_id: true,
  major_name: true,
  major_acronym: true,
  major_id: true,
  created_at: true,
  is_deleted: true,
  Major: { select: { Cycle: true } },
  Department: {
    select: { department_id: true, department_acronym: true },
  },
});

@Injectable()
export class MajorsService {
  constructor(private prismaService: GlomPrismaService) {}

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
        new AnnualMajorEntity({ cycle, ...major, ...department })
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
    return new AnnualMajorEntity({ cycle, ...major, ...department });
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
    await this.prismaService.department.findFirstOrThrow({
      where: { department_id, is_deleted: false },
    });
    const cycle = await this.prismaService.cycle.findUniqueOrThrow({
      where: { cycle_id },
    });
    const annualMajorId = randomUUID();
    const { classrooms, annualClassrooms, annualClassroomDivisions } =
      await this.generateClassrooms(
        annualMajorId,
        cycle.number_of_years,
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
          Major: { select: { Cycle: true } },
          Department: { select: { department_acronym: true } },
        },
        data: {
          major_name,
          major_acronym,
          Major: {
            create: {
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
      cycle: majorCycle,
      ...department,
      ...newAnnualMajor,
    });
  }

  private async generateClassrooms(
    annual_major_id: string,
    number_of_years: number,
    created_by: string
  ) {
    const classrooms: Prisma.ClassroomCreateManyMajorInput[] = [];
    const annualClassrooms: Prisma.AnnualClassroomCreateManyInput[] = [];
    const annualClassroomDivisions: Prisma.AnnualClassroomDivisionCreateManyInput[] =
      [];
    for (
      let classroom_level = 1;
      classroom_level <= number_of_years;
      classroom_level++
    ) {
      const classroom_id = randomUUID();
      classrooms.push({
        classroom_id,
        classroom_level,
        created_by,
      });
      const annual_classroom_id = randomUUID();
      annualClassrooms.push({
        classroom_id,
        classroom_level,
        annual_major_id,
        annual_classroom_id,
        number_of_divisions: 1,
      });
      annualClassroomDivisions.push({
        division_letter: 'A',
        annual_classroom_id,
        created_by,
      });
    }
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
    const { AnnualModules, ...annualMajorAudit } =
      await this.prismaService.annualMajor.findFirstOrThrow({
        select: {
          annual_major_id: true,
          major_acronym: true,
          major_name: true,
          is_deleted: true,
          AnnualModules: true,
        },
        where: { annual_major_id },
      });
    await this.prismaService.$transaction([
      this.prismaService.annualMajor.update({
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
      }),
      ...(payload.is_deleted
        ? [
            this.prismaService.annualModule.updateMany({
              data: { is_deleted: true },
              where: { annual_major_id },
            }),
            this.prismaService.annualSubject.updateMany({
              data: { is_deleted: true },
              where: {
                OR: AnnualModules.map(({ annual_module_id }) => ({
                  annual_module_id,
                })),
              },
            }),
            this.prismaService.annualClassroom.updateMany({
              data: { is_deleted: true },
              where: { annual_major_id },
            }),
          ]
        : []),
    ]);
  }
  async disableMany(annualMajorIds: string[], disabled_by: string) {
    await Promise.all(
      annualMajorIds.map((annualMajorId) =>
        this.update(annualMajorId, { is_deleted: true }, disabled_by)
      )
    );
  }
}
