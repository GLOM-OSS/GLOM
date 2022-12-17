import { Injectable } from '@nestjs/common';
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

  
  async getEvaluationTypeWeighting(cycle_id: string, academic_year_id: string) {
    const evaluationWeighting =
      await this.prismaService.annualEvaluationTypeWeighting.findMany({
        take: 2,
        select: {
          weight: true,
          EvaluationType: { select: { evaluation_type: true } },
        },
        where: { academic_year_id, cycle_id },
      });

    const minimumModulationScore =
      await this.prismaService.annualMinimumModulationScore.findFirst({
        select: { score: true },
        where: { academic_year_id, cycle_id },
      });

    return {
      minimum_modulation_score: minimumModulationScore?.score ?? 0,
      evaluationTypeWeightings: evaluationWeighting.map(
        ({ EvaluationType: { evaluation_type }, weight }) => ({
          weight,
          evaluation_type,
        })
      ),
    };
  }

  // async upsertEvaluationTypeWeighting(newEvaluationTypeWeighting: EvaluationTypeWeightingPutDto, academic_year_id: string, ) {
  //   const 
  // }
}
