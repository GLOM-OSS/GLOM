import { Injectable } from '@nestjs/common';
import { PrismaService } from 'apps/api/src/prisma/prisma.service';

@Injectable()
export class WeightingSystemService {
  constructor(private prismaService: PrismaService) {}

  async getAnnualWeighting(academic_year_id: string) {
    return this.prismaService.annualWeighting.findUnique({
      where: { academic_year_id },
    });
  }
}
