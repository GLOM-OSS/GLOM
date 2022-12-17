import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CarryOverSystemPutDto } from '../registry.dto';

@Injectable()
export class CarryOverSystemService {
  constructor(private prismaService: PrismaService) {}

  async getCarryOverSystem(academic_year_id: string) {
    return this.prismaService.annualCarryOverSytem.findUnique({
      select: { annual_carry_over_system_id: true, carry_over_system: true },
      where: { academic_year_id },
    });
  }

  async updateCarryOverSytem(
    { carry_over_system: newCarryOverSytem }: CarryOverSystemPutDto,
    academic_year_id: string,
    annual_registry_id: string
  ) {
    const { carry_over_system } =
      await this.prismaService.annualCarryOverSytem.findUnique({
        select: { carry_over_system: true },
        where: { academic_year_id },
      });

    return this.prismaService.annualCarryOverSytem.update({
      data: {
        carry_over_system: newCarryOverSytem,
        AnnualCarryOverSytemAudits: {
          create: {
            carry_over_system,
            AnnualRegistry: { connect: { annual_registry_id } },
          },
        },
      },
      where: { academic_year_id },
    });
  }
}
