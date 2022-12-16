import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AcademicProfileService {
  constructor(private prismaService: PrismaService) {}

  async getAcademicProfiles(academic_year_id: string) {
    return this.prismaService.annualAcademicProfile.findMany({
      where: { academic_year_id, is_deleted: false },
    });
  }

  async getAcademicProfile(annual_academic_profile_id: string) {
    return this.prismaService.annualAcademicProfile.findUnique({
      where: { annual_academic_profile_id },
    });
  }
}
