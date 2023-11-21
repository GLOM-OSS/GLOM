import { GlomPrismaService } from '@glom/prisma';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { QueryAcademicProfile } from './academic-profile';
import {
  AcademicProfileEntity,
  CreateAcademicProfileDto,
  UpdateAcademicProfileDto,
} from './academic-profile.dto';
import { CycleSettingMeta } from '../cycle-settings';

@Injectable()
export class AcademicProfilesService {
  constructor(private prismaService: GlomPrismaService) {}

  async findAll(metaParams: QueryAcademicProfile) {
    const academicProfiles =
      await this.prismaService.annualAcademicProfile.findMany({
        where: { ...metaParams, is_deleted: false },
      });

    return academicProfiles.map(
      (academicProfile) => new AcademicProfileEntity(academicProfile)
    );
  }

  async create(
    {
      comment,
      cycle_id,
      maximum_point,
      minimum_point,
    }: CreateAcademicProfileDto,
    academic_year_id: string,
    audited_by: string
  ) {
    await this.validateOrThrow(minimum_point, maximum_point, {
      academic_year_id,
      cycle_id,
    });

    const academicProfile =
      await this.prismaService.annualAcademicProfile.create({
        data: {
          comment,
          maximum_point,
          minimum_point,
          CreatedBy: { connect: { annual_registry_id: audited_by } },
          AcademicYear: {
            connect: { academic_year_id },
          },
          Cycle: { connect: { cycle_id } },
        },
      });

    return new AcademicProfileEntity(academicProfile);
  }

  async validateOrThrow(
    minimum_point: number,
    maximum_point: number,
    metaParams: CycleSettingMeta,
    annual_academic_profile_id?: string
  ) {
    if (maximum_point < minimum_point)
      throw new BadRequestException(
        'maximum point must be greater than minimum point'
      );
    const { weighting_system } =
      await this.prismaService.annualWeighting.findUniqueOrThrow({
        where: { academic_year_id_cycle_id: metaParams },
      });
    if (maximum_point > weighting_system)
      throw new BadRequestException(
        'maximum point cannot be greater than weighting system'
      );
    const profile = await this.prismaService.annualAcademicProfile.findFirst({
      where: {
        ...metaParams,
        is_deleted: false,
        annual_academic_profile_id: { not: annual_academic_profile_id ?? null },
        OR: [
          { minimum_point: { gte: minimum_point, lte: maximum_point } },
          { maximum_point: { gte: minimum_point, lte: maximum_point } },
          {
            minimum_point: { gte: minimum_point },
            maximum_point: { lte: maximum_point },
          },
          {
            minimum_point: { lte: minimum_point },
            maximum_point: { gte: maximum_point },
          },
        ],
      },
    });
    if (profile)
      throw new ConflictException('Academic profile overlapping !!!');
  }
}
