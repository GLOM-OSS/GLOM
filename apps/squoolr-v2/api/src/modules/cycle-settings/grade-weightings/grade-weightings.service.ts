import { GlomPrismaService } from '@glom/prisma';
import { excludeKeys } from '@glom/utils';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CycleSettingMeta, QueryWeightingSettings } from '../cycle-settings';
import {
  CreateGradeWeightingDto,
  GradeWeightingEntity,
  UpdateGradeWeightingDto,
} from './grade-weighting.dto';

@Injectable()
export class GradeWeightingsService {
  constructor(private prismaService: GlomPrismaService) {}

  async findAll({ weighting_system, ...metaParams }: QueryWeightingSettings) {
    const gradeWeightings =
      await this.prismaService.annualGradeWeighting.findMany({
        where: { ...metaParams, maximum: { lte: weighting_system } },
      });
    return gradeWeightings.map(
      (gradeWeighting) => new GradeWeightingEntity(gradeWeighting)
    );
  }

  async create(
    { cycle_id, ...newGradeWeighting }: CreateGradeWeightingDto,
    academic_year_id: string,
    created_by: string
  ) {
    await this.validateOrThrow(newGradeWeighting, {
      cycle_id,
      academic_year_id,
    });
    const gradeWeighting = await this.prismaService.annualGradeWeighting.create(
      {
        data: {
          ...newGradeWeighting,
          AcademicYear: {
            connect: { academic_year_id },
          },
          Cycle: { connect: { cycle_id } },
          CreatedBy: { connect: { annual_registry_id: created_by } },
        },
      }
    );
    return new GradeWeightingEntity(gradeWeighting);
  }

  async update(
    annual_grade_weighting_id: string,
    updatePayload: UpdateGradeWeightingDto,
    audited_by: string
  ) {
    const { academic_year_id, cycle_id, ...gradeWeighting } =
      await this.prismaService.annualGradeWeighting.findFirst({
        where: { annual_grade_weighting_id, is_deleted: true },
      });
    await this.validateOrThrow(
      updatePayload,
      { academic_year_id, cycle_id },
      annual_grade_weighting_id
    );
    await this.prismaService.annualGradeWeighting.update({
      data: {
        ...updatePayload,
        AnnualGradeWeightingAudits: {
          create: {
            ...excludeKeys(gradeWeighting, [
              'annual_grade_weighting_id',
              'created_at',
              'created_by',
            ]),
            AuditedBy: { connect: { annual_registry_id: audited_by } },
          },
        },
      },
      where: { annual_grade_weighting_id },
    });
  }

  async validateOrThrow(
    {
      point,
      maximum,
      minimum,
    }: Omit<CreateGradeWeightingDto, 'grade' | 'cycle_id'>,
    metaParams: CycleSettingMeta,
    annual_grade_weighting_id?: string
  ) {
    if (maximum < minimum)
      throw new BadRequestException(
        'maximum point must be greater than minimum point'
      );
    const { weighting_system } =
      await this.prismaService.annualWeighting.findUniqueOrThrow({
        where: { academic_year_id_cycle_id: metaParams },
      });
    if (point > weighting_system)
      throw new BadRequestException(
        'Grade weighting point cannot be greater than weighting system'
      );
    const gradeWeighting =
      await this.prismaService.annualGradeWeighting.findFirst({
        where: {
          ...metaParams,
          is_deleted: false,
          annual_grade_weighting_id: {
            not: annual_grade_weighting_id ?? null,
          },
          OR: [
            { minimum: { gte: minimum, lte: maximum } },
            { maximum: { gte: minimum, lte: maximum } },
            {
              minimum: { gte: minimum },
              maximum: { lte: maximum },
            },
            {
              minimum: { lte: minimum },
              maximum: { gte: maximum },
            },
          ],
        },
      });
    if (gradeWeighting)
      throw new ConflictException('Grade weighting overlapping !!!');
  }
}
