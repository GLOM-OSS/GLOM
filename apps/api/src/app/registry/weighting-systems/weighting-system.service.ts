import { Injectable } from '@nestjs/common';
import { GradeWeighting } from '@squoolr/interfaces';
import { PrismaService } from '../../../prisma/prisma.service';
import { WeightingPutDto } from '../registry.dto';

@Injectable()
export class WeightingSystemService {
  constructor(private prismaService: PrismaService) {}

  async getAnnualWeighting(academic_year_id: string, cycle_id: string) {
    return this.prismaService.annualWeighting.findUnique({
      where: { academic_year_id_cycle_id: { academic_year_id, cycle_id } },
    });
  }

  async upsertAnnualWeighting(
    { cycle_id, weighting_system }: WeightingPutDto,
    academic_year_id: string,
    annual_registry_id: string
  ) {
    const annualWeighting = await this.prismaService.annualWeighting.findUnique(
      {
        select: { weighting_system: true },
        where: { academic_year_id_cycle_id: { academic_year_id, cycle_id } },
      }
    );
    return this.prismaService.annualWeighting.upsert({
      create: {
        weighting_system,
        Cycle: { connect: { cycle_id } },
        AcademicYear: { connect: { academic_year_id } },
        AnnualRegistry: { connect: { annual_registry_id } },
      },
      update: {
        weighting_system,
        Cycle: { connect: { cycle_id } },
        AnnualWeightingAudits: {
          create: {
            ...annualWeighting,
            AnnualRegistry: { connect: { annual_registry_id } },
          },
        },
        AnnualRegistry: { connect: { annual_registry_id } },
      },
      where: { academic_year_id_cycle_id: { cycle_id, academic_year_id } },
    });
  }

  async getAnnualGradeWeightings(cycle_id: string): Promise<GradeWeighting[]> {
    const annualGradeWeightings =
      await this.prismaService.annualGradeWeighting.findMany({
        select: {
          point: true,
          maximum: true,
          minimum: true,
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

  async getAnnualWeightingGrade(annual_grade_weighting_id: string) {
    return this.prismaService.annualGradeWeighting.findUnique({
        where: { annual_grade_weighting_id },
      });
  }
}
