import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import { QueryWeightingSettings } from '../cycle-settings';
import { GradeWeightingEntity } from './grade-weighting.dto';

@Injectable()
export class GradeWeightingsService {
  constructor(private prismaService: GlomPrismaService) {}

  async getGradeWeightings({
    weighting_system,
    ...metaParams
  }: QueryWeightingSettings) {
    const gradeWeightings =
      await this.prismaService.annualGradeWeighting.findMany({
        where: { ...metaParams, maximum: { lte: weighting_system } },
      });
    return gradeWeightings.map(
      (gradeWeighting) => new GradeWeightingEntity(gradeWeighting)
    );
  }
}
