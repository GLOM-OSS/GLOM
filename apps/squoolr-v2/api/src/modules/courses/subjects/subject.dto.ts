import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { AnnualSubject } from '@prisma/client';
import { Exclude, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  ValidateNested,
} from 'class-validator';
import { QueryParamsDto } from '../../modules.dto';
import { CreateCourseModuleDto } from '../modules/module.dto';

export class CreateSubjectPartDto {
  @IsNumber()
  @ApiProperty()
  number_of_hours: number;

  @IsString()
  @ApiProperty()
  subject_part_id: string;

  constructor(props: CreateSubjectPartDto) {
    Object.assign(this, props);
  }
}

export class CourseSubjectPart extends CreateSubjectPartDto {
  @IsString()
  @ApiProperty()
  subject_part_name: string;

  constructor(props: CourseSubjectPart) {
    super(props);
    Object.assign(this, props);
  }
}

export class CreateModuleNestedDto extends PickType(CreateCourseModuleDto, [
  'credit_points',
  'semester_number',
  'annual_classroom_id',
]) {}

export class CreateCourseSubjectDto {
  @Max(100)
  @IsPositive()
  @ApiProperty()
  weighting: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  objective: string | null;

  @IsString()
  @ApiProperty()
  subject_code: string;

  @IsString()
  @ApiProperty()
  subject_name: string;

  @IsString()
  @ApiProperty()
  annual_teacher_id: string;

  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateSubjectPartDto)
  @ApiProperty({ type: [CreateSubjectPartDto] })
  subjectParts: CreateSubjectPartDto[];

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  annual_module_id: string | null;

  @IsOptional()
  @ValidateNested()
  @ApiPropertyOptional()
  @Type(() => CreateModuleNestedDto)
  module?: CreateModuleNestedDto;

  constructor(props: CreateCourseSubjectDto) {
    Object.assign(this, props);
  }
}

export class SubjectEntity
  extends CreateCourseSubjectDto
  implements AnnualSubject
{
  @ApiProperty()
  annual_subject_id: string;

  @ApiProperty()
  is_deleted: boolean;

  @ApiProperty()
  created_at: Date;

  @Exclude()
  @ApiHideProperty()
  created_by: string;

  @ValidateNested({ each: true })
  @Type(() => CourseSubjectPart)
  @ApiProperty({ type: [CourseSubjectPart] })
  subjectParts: CourseSubjectPart[];

  constructor(props: SubjectEntity) {
    super(props);
    Object.assign(this, props);
  }
}

export class QueryCourseSubjectDto extends QueryParamsDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  annual_module_id?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  annual_teacher_id?: string;
}

export class UpdateCourseSubjectDto extends OmitType(
  PartialType(CreateCourseSubjectDto),
  ['annual_module_id']
) {
  @IsBoolean()
  @ApiProperty()
  disable: boolean;
}

export class DisableCourseSubjectDto {
  @ApiProperty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  annualSubjectIds: string[];

  @IsBoolean()
  @ApiProperty()
  disable: boolean;
}
