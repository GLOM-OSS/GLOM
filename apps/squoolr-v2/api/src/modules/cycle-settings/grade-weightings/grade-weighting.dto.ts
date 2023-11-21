import { ApiHideProperty, ApiProperty, PartialType } from '@nestjs/swagger';
import { AnnualGradeWeighting } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsNumber, IsPositive, IsString, Length, Max } from 'class-validator';

export class CreateGradeWeightingDto {
  @IsString()
  @ApiProperty()
  cycle_id: string;

  @Max(99)
  @IsPositive()
  @ApiProperty()
  minimum: number;

  @Max(100)
  @IsPositive()
  @ApiProperty()
  maximum: number;

  @Length(1, 2)
  @ApiProperty({ example: 'A+' })
  grade: string;

  @IsPositive()
  @ApiProperty()
  point: number;

  constructor(props: CreateGradeWeightingDto) {
    Object.entries(props).forEach(([key, value]) => {
      if (key in this) this[key] = value;
    });
  }
}

export class UpdateCreateWeightingDto extends PartialType(
  CreateGradeWeightingDto
) {}

export class GradeWeightingEntity
  extends CreateGradeWeightingDto
  implements AnnualGradeWeighting
{
  @ApiProperty()
  annual_grade_weighting_id: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  academic_year_id: string;

  @Exclude()
  @ApiHideProperty()
  is_deleted: boolean;

  @Exclude()
  @ApiHideProperty()
  created_by: string;

  constructor(props: GradeWeightingEntity) {
    super(props);
    Object.entries(props).forEach(([key, value]) => {
      if (key in this) this[key] = value;
    });
  }
}
