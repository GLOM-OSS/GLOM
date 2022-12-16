import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ERR09 } from '../../../errors';
import { PrismaService } from '../../../prisma/prisma.service';
import { AcademicProfilePostDto } from '../registry.dto';

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

  async addNewAcademicProfile(
    { comment, maximum_score, minimum_score }: AcademicProfilePostDto,
    academic_year_id: string,
    annual_registry_id: string
  ) {
    const academicProfile =
      await this.prismaService.annualAcademicProfile.findFirst({
        where: {
          academic_year_id,
          OR: [
            { minimum_score: minimum_score },
            { maximum_score: maximum_score },
            {
              minimum_score: { lt: minimum_score },
              maximum_score: { gt: minimum_score },
            },
            {
              minimum_score: { lt: maximum_score },
              maximum_score: { gt: maximum_score },
            },
            {
              minimum_score: { gt: minimum_score },
              maximum_score: { lt: maximum_score },
            },
          ],
        },
      });
    if (academicProfile)
      throw new HttpException(JSON.stringify(ERR09), HttpStatus.CONFLICT);
    return this.prismaService.annualAcademicProfile.create({
      data: {
        comment,
        maximum_score,
        minimum_score,
        AcademicYear: { connect: { academic_year_id } },
        AnnualRegistry: { connect: { annual_registry_id } },
      },
    });
  }
}
