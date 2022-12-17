import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CarryOverSystemService {
  constructor(private prismaService: PrismaService) {}

  async getCarryOverSystem(academic_year_id: string) {
    return this.prismaService.annualCarryOverSytem.findUnique({
      select: { annual_carry_over_system_id: true, carry_over_system: true },
      where: { academic_year_id },
    });
  }
}
