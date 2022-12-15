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
}
