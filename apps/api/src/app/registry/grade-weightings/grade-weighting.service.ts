import { Injectable } from "@nestjs/common";
import { GradeWeighting } from "@squoolr/interfaces";
import { PrismaService } from "apps/api/src/prisma/prisma.service";

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