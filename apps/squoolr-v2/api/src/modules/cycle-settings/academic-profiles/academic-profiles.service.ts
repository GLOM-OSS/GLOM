import { GlomPrismaService } from '@glom/prisma';
import { excludeKeys } from '@glom/utils';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CycleSettingMeta, QueryWeightingSettings } from '../cycle-settings';
import {
  AcademicProfileEntity,
  CreateAcademicProfileDto,
  UpdateAcademicProfileDto,
} from './academic-profile.dto';

@Injectable()
export class AcademicProfilesService {
  constructor(private prismaService: GlomPrismaService) {}

  async findAll(metaParams: QueryWeightingSettings) {
    const academicProfiles =
      await this.prismaService.annualAcademicProfile.findMany({
        orderBy: { maximum_point: 'desc' },
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

  async update(
    annual_academic_profile_id: string,
    { comment, maximum_point, minimum_point }: UpdateAcademicProfileDto,
    audited_by: string
  ) {
    const { academic_year_id, cycle_id, ...academicProfileAudit } =
      await this.prismaService.annualAcademicProfile.findFirstOrThrow({
        where: { is_deleted: false, annual_academic_profile_id },
      });
    await this.validateOrThrow(
      minimum_point,
      maximum_point,
      { academic_year_id, cycle_id },
      annual_academic_profile_id
    );
    await this.prismaService.annualAcademicProfile.update({
      data: {
        comment,
        maximum_point,
        minimum_point,
        AnnualAcademicProfileAudits: {
          create: {
            ...excludeKeys(academicProfileAudit, [
              'annual_academic_profile_id',
              'created_at',
              'created_by',
            ]),
            AuditedBy: { connect: { annual_registry_id: audited_by } },
          },
        },
      },
      where: { annual_academic_profile_id },
    });
  }

  async delete(annual_academic_profile_id: string, audited_by: string) {
    const academicProfile =
      await this.prismaService.annualAcademicProfile.findFirstOrThrow({
        select: {
          comment: true,
          is_deleted: true,
          maximum_point: true,
          minimum_point: true,
        },
        where: { annual_academic_profile_id, is_deleted: false },
      });
    await this.prismaService.annualAcademicProfile.update({
      data: {
        is_deleted: true,
        AnnualAcademicProfileAudits: {
          create: {
            ...academicProfile,
            AuditedBy: { connect: { annual_registry_id: audited_by } },
          },
        },
      },
      where: { annual_academic_profile_id },
    });
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
    const academicProfile =
      await this.prismaService.annualAcademicProfile.findFirst({
        where: {
          ...metaParams,
          is_deleted: false,
          annual_academic_profile_id: {
            not: annual_academic_profile_id ?? null,
          },
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
    if (academicProfile)
      throw new ConflictException('Academic profile overlapping !!!');
  }
}
