import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AUTH404, ERR09 } from '../../../errors';
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

  async getOverlappingProfile(
    academic_year_id: string,
    {
      maximum_score,
      minimum_score,
      exculed_profile_id,
    }: {
      minimum_score: number;
      maximum_score: number;
      exculed_profile_id?: string;
    }
  ) {
    return this.prismaService.annualAcademicProfile.findFirst({
      where: {
        academic_year_id,
        ...(exculed_profile_id
          ? { annual_academic_profile_id: { not: exculed_profile_id } }
          : {}),
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
  }

  async addNewAcademicProfile(
    { comment, maximum_score, minimum_score }: AcademicProfilePostDto,
    academic_year_id: string,
    annual_registry_id: string
  ) {
    const overlappedProfile = await this.getOverlappingProfile(
      academic_year_id,
      {
        maximum_score,
        minimum_score,
      }
    );
    if (overlappedProfile)
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

  async updateAcademicProfile(
    annual_academic_profile_id: string,
    {
      maximum_score,
      minimum_score,
      is_deleted,
      comment,
    }: Prisma.AnnualAcademicProfileUpdateInput,
    annual_registry_id: string
  ) {
    const overlappedProfile =
      await this.prismaService.annualAcademicProfile.findUnique({
        select: {
          comment: true,
          is_deleted: true,
          maximum_score: true,
          minimum_score: true,
          academic_year_id: true,
        },
        where: { annual_academic_profile_id },
      });
    if (!overlappedProfile)
      throw new HttpException(
        JSON.stringify(AUTH404('Academic Profile')),
        HttpStatus.NOT_FOUND
      );
    const { academic_year_id, ...overlappedProfileData } = overlappedProfile;
    const academicProfile = await this.getOverlappingProfile(academic_year_id, {
      exculed_profile_id: annual_academic_profile_id,
      maximum_score: maximum_score
        ? (maximum_score as number)
        : overlappedProfile.maximum_score,
      minimum_score: minimum_score
        ? (minimum_score as number)
        : overlappedProfile.minimum_score,
    });
    if (academicProfile)
      throw new HttpException(JSON.stringify(ERR09), HttpStatus.CONFLICT);
    return this.prismaService.annualAcademicProfile.update({
      data: {
        comment,
        is_deleted,
        maximum_score,
        minimum_score,
        AnnualRegistry: { connect: { annual_registry_id } },
        AnnualAcademicProfileAudits: {
          create: {
            ...overlappedProfileData,
            audited_by: annual_registry_id,
          },
        },
      },
      where: { annual_academic_profile_id },
    });
  }
}
