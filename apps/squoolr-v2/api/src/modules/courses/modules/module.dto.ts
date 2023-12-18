import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { AnnualModule } from '@prisma/client';
import { Exclude, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { QueryParamsDto } from '../../modules.dto';

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
) {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  disable?: boolean;
}

export class ModuleEntity
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

  constructor(props: ModuleEntity) {
    super(props);
    Object.assign(this, props);
  }
}
export class QueryCourseModuleDto extends QueryParamsDto {
  @IsArray()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional()
  semesters?: number[];

  @IsString()
  @ApiProperty()
  annual_classroom_id: string;
}

export class DisableCourseModuleDto {
  @ApiProperty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  annualModuleIds: string[];

  @IsBoolean()
  @ApiProperty()
  disable: boolean;
}
