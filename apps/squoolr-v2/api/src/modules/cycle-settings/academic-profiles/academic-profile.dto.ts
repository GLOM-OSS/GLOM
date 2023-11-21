import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { AnnualAcademicProfile } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsPositive, IsString } from 'class-validator';

export class CreateAcademicProfileDto {
  @IsString()
  @ApiProperty()
  cycle_id: string;

  @IsPositive()
  @ApiProperty()
  minimum_point: number;

  @IsPositive()
  @ApiProperty()
  maximum_point: number;

  @IsString()
  @ApiProperty()
  comment: string;

  constructor(props: CreateAcademicProfileDto) {
    Object.assign(this, props);
  }
}

export class AcademicProfileEntity
  extends CreateAcademicProfileDto
  implements AnnualAcademicProfile
{
  @ApiProperty()
  annual_academic_profile_id: string;

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

  constructor(props: AcademicProfileEntity) {
    super(props);
    Object.assign(this, props);
  }
}
