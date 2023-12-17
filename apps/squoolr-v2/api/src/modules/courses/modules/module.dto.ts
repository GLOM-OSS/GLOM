import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { AnnualModule } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCourseModuleDto {
  @IsString()
  @ApiProperty()
  module_name: string;

  @IsString()
  @ApiPropertyOptional()
  module_code: string | null;

  @IsNumber()
  @ApiProperty()
  credit_points: number;

  @IsIn([1, 2])
  @IsOptional()
  @ApiPropertyOptional()
  semester_number: number | null;

  @IsString()
  @ApiProperty()
  annual_classroom_id: string;

  constructor(props: CreateCourseModuleDto) {
    Object.assign(this, props);
  }
}

export class UpdateCourseModuleDto extends OmitType(
  PartialType(CreateCourseModuleDto),
  ['annual_classroom_id']
) {}

export class CourseModuleEntity
  extends CreateCourseModuleDto
  implements AnnualModule
{
  @ApiProperty()
  annual_module_id: string;

  @ApiProperty()
  is_exam_published: boolean;

  @ApiProperty()
  is_resit_published: boolean;

  @ApiProperty()
  is_deleted: boolean;

  @ApiProperty()
  created_at: Date;

  @Exclude()
  @ApiHideProperty()
  academic_year_id: string;

  @Exclude()
  @ApiHideProperty()
  created_by: string;

  constructor(props: CourseModuleEntity) {
    super(props);
    Object.assign(this, props);
  }
}
