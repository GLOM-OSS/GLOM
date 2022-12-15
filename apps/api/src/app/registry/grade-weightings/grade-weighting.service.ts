import { Injectable } from '@nestjs/common';
import { GradeWeighting } from '@squoolr/interfaces';
import { PrismaService } from 'apps/api/src/prisma/prisma.service';
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
}
