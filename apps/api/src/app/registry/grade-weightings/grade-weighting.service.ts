import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GradeWeighting } from '@squoolr/interfaces';
import { AUTH404 } from '../../../errors';
import { PrismaService } from '../../../prisma/prisma.service';
import { GradeWeightingPostDto } from '../registry.dto';

@Injectable()
export class GradeWeightingService {
  constructor(private prismaService: PrismaService) {}

  async getAnnualGradeWeightings(cycle_id: string): Promise<GradeWeighting[]> {
    const annualGradeWeightings =
      await this.prismaService.annualGradeWeighting.findMany({
        select: {
          point: true,
          maximum: true,
          minimum: true,
          cycle_id: true,
          grade_id: true,
          observation: true,
          annual_grade_weighting_id: true,
          Grade: { select: { grade_value: true } },
        },
        where: { cycle_id, is_deleted: false },
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

  async addNewGradeWeighting(
    { grade_id, cycle_id, ...newGradeWeighting }: GradeWeightingPostDto,
    academic_year_id: string,
    annual_registry_id: string
  ) {
    return this.prismaService.annualGradeWeighting.create({
      data: {
        ...newGradeWeighting,
        Cycle: { connect: { cycle_id } },
        Grade: { connect: { grade_id } },
        AcademicYear: { connect: { academic_year_id } },
        AnnualRegistry: { connect: { annual_registry_id } },
      },
    });
  }

  async updateGradeWeighting(
    annual_grade_weighting_id: string,
    newGradeWeighting: Prisma.AnnualGradeWeightingUpdateInput,
    annual_registry_id: string
  ) {
    const annualGradeWeighting =
      await this.prismaService.annualGradeWeighting.findUnique({
        select: {
          grade_id: true,
          minimum: true,
          maximum: true,
          point: true,
          observation: true,
          is_deleted: true,
        },
        where: { annual_grade_weighting_id },
      });
    if (!annualGradeWeighting)
      throw new HttpException(
        JSON.stringify(AUTH404('Grade Weighting')),
        HttpStatus.NOT_FOUND
      );

    return this.prismaService.annualGradeWeighting.update({
      data: {
        ...newGradeWeighting,
        AnnualGradeWeightingAudits: {
          create: {
            ...annualGradeWeighting,
            audited_by: annual_registry_id,
          },
        },
      },
      where: { annual_grade_weighting_id },
    });
  }
}
