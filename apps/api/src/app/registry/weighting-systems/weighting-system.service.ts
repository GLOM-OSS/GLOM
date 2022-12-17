import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  EvaluationTypeWeightingPutDto,
  WeightingPutDto,
} from '../registry.dto';

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

  async upsertEvaluationTypeWeighting(
    cycle_id: string,
    {
      evaluationTypeWeightings: newEvaluationTypeWeightings,
      minimum_modulation_score,
    }: EvaluationTypeWeightingPutDto,
    academic_year_id: string,
    annual_registry_id: string
  ) {
    const evaluationTypeWeightings =
      await this.prismaService.annualEvaluationTypeWeighting.findMany({
        select: { evaluation_type_id: true, weight: true },
        where: { academic_year_id, cycle_id },
      });
    const evaluationTypes = await this.prismaService.evaluationType.findMany();
    const { score } =
      await this.prismaService.annualMinimumModulationScore.findUnique({
        select: { score: true },
        where: { academic_year_id_cycle_id: { academic_year_id, cycle_id } },
      });

    this.prismaService.$transaction([
      ...newEvaluationTypeWeightings.map((etw) => {
        const { evaluation_type_id } = evaluationTypes.find(
          (_) => _.evaluation_type === etw.evaluation_type
        );
        return this.prismaService.annualEvaluationTypeWeighting.update({
          data: {
            weight: etw.weight,
            AnnualEvaluationTypeWeightingAudits: {
              create: {
                weight: evaluationTypeWeightings.find(
                  (_) => _.evaluation_type_id === evaluation_type_id
                ).weight,
                audited_by: annual_registry_id,
              },
            },
          },
          where: {
            academic_year_id_evaluation_type_id_cycle_id: {
              cycle_id,
              academic_year_id,
              evaluation_type_id,
            },
          },
        });
      }),
      this.prismaService.annualMinimumModulationScore.update({
        data: {
          score: minimum_modulation_score,
          AnnualMinimumModulationScoreAudits: {
            create: {
              score,
              configured_by: annual_registry_id,
            },
          },
        },
        where: { academic_year_id_cycle_id: { cycle_id, academic_year_id } },
      }),
    ]);
  }
}
