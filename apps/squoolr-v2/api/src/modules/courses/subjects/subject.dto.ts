import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { AnnualSubject } from '@prisma/client';
import { Exclude, Type } from 'class-transformer';
import {
  IsNumber,
  IsPositive,
  IsString,
  Max,
  ValidateNested,
} from 'class-validator';
import { QueryParamsDto } from '../../modules.dto';

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

export class CreateCourseSubjectDto {
  @Max(100)
  @IsPositive()
  @ApiProperty()
  weighting: number;

  @IsString()
  @ApiProperty()
  objective: string;

  @IsString()
  @ApiProperty()
  subject_code: string;

  @IsString()
  @ApiProperty()
  subject_name: string;

  @IsString()
  @ApiProperty()
  annual_module_id: string;

  @ValidateNested({ each: true })
  @Type(() => CreateSubjectPartDto)
  @ApiProperty({ type: [CreateSubjectPartDto] })
  subjectParts: CreateSubjectPartDto[];

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
  @ApiProperty()
  annual_module_id: string;
}
