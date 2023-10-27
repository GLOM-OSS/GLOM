import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import { AnnualMajorEntity, QueryMajorDto } from './major.dto';
import { Prisma } from '@prisma/client';

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
                Department: { department_code: params.department_code },
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
}
