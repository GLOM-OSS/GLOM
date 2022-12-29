import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GradeWeighting } from '@squoolr/interfaces';
import { AUTH404, ERR09 } from '../../../errors';
import { PrismaService } from '../../../prisma/prisma.service';
import { GradeWeightingPostDto } from '../registry.dto';

@Injectable()
export class GradeWeightingService {
  constructor(private prismaService: PrismaService) {}

  async getAnnualGradeWeightings(
    academic_year_id: string,
    cycle_id: string
  ): Promise<GradeWeighting[]> {
    const annualGradeWeightings =
      await this.prismaService.annualGradeWeighting.findMany({
        select: {
          point: true,
          maximum: true,
          minimum: true,
          grade_id: true,
          cycle_id: true,
          observation: true,
          annual_grade_weighting_id: true,
          Grade: { select: { grade_value: true } },
        },
        where: { cycle_id, academic_year_id, is_deleted: false },
      });
    return annualGradeWeightings.map(
      ({ Grade: { grade_value }, ...annualGradeWeighting }) => ({
        grade_value,
        ...annualGradeWeighting,
      })
    );
  }

  async getAnnualGradeWeighting(annual_grade_weighting_id: string) {
    return this.prismaService.annualGradeWeighting.findUnique({
      where: { annual_grade_weighting_id },
    });
  }

  async getOverlappingWeighting(
    academic_year_id: string,
    {
      maximum,
      minimum,
      exculed_grade_weighting_id,
    }: {
      minimum: number;
      maximum: number;
      exculed_grade_weighting_id?: string;
    }
  ) {
    return this.prismaService.annualGradeWeighting.findFirst({
      where: {
        academic_year_id,
        ...(exculed_grade_weighting_id
          ? { annual_grade_weighting_id: { not: exculed_grade_weighting_id } }
          : {}),
        is_deleted: false,
        OR: [
          { minimum },
          { maximum },
          {
            minimum: { lt: minimum },
            maximum: { gt: minimum },
          },
          {
            minimum: { lt: maximum },
            maximum: { gt: maximum },
          },
          {
            minimum: { gt: minimum },
            maximum: { lt: maximum },
          },
        ],
      },
    });
  }

  async addNewGradeWeighting(
    { grade_id, cycle_id, maximum, minimum, ...newGradeWeighting }: GradeWeightingPostDto,
    academic_year_id: string,
    annual_registry_id: string
  ) {
    const overlappedWieghting = await this.getOverlappingWeighting(
      academic_year_id,
      { maximum, minimum }
    );
    if (overlappedWieghting)
      throw new HttpException(JSON.stringify(ERR09), HttpStatus.CONFLICT);
    const {
      Grade: { grade_value },
      ...newGrade
    } = await this.prismaService.annualGradeWeighting.create({
      include: { Grade: { select: { grade_value: true } } },
      data: {
        maximum,
        minimum,
        ...newGradeWeighting,
        Cycle: { connect: { cycle_id }},
        Grade: { connect: { grade_id } },
        AcademicYear: { connect: { academic_year_id } },
        AnnualRegistry: { connect: { annual_registry_id } },
      },
    });
    return { grade_value, ...newGrade };
  }

  async updateGradeWeighting(
    annual_grade_weighting_id: string,
    {
      minimum,
      maximum,
      ...newGradeWeighting
    }: Prisma.AnnualGradeWeightingUpdateInput,
    annual_registry_id: string
  ) {
    const annualGradeWeighting =
      await this.prismaService.annualGradeWeighting.findUnique({
        select: {
          point: true,
          minimum: true,
          maximum: true,
          grade_id: true,
          is_deleted: true,
          observation: true,
          academic_year_id: true,
        },
        where: { annual_grade_weighting_id },
      });
    if (!annualGradeWeighting)
      throw new HttpException(
        JSON.stringify(AUTH404('Grade Weighting')),
        HttpStatus.NOT_FOUND
      );
    const { academic_year_id, ...annualGradeWeightingData } =
      annualGradeWeighting;
    const overlappedWieghting = await this.getOverlappingWeighting(
      academic_year_id,
      {
        exculed_grade_weighting_id: annual_grade_weighting_id,
        maximum: maximum ? (maximum as number) : annualGradeWeighting.maximum,
        minimum: minimum ? (minimum as number) : annualGradeWeighting.minimum,
      }
    );
    if (overlappedWieghting)
      throw new HttpException(JSON.stringify(ERR09), HttpStatus.CONFLICT);
    return this.prismaService.annualGradeWeighting.update({
      data: {
        ...newGradeWeighting,
        AnnualGradeWeightingAudits: {
          create: {
            ...annualGradeWeightingData,
            audited_by: annual_registry_id,
          },
        },
      },
      where: { annual_grade_weighting_id },
    });
  }
}
