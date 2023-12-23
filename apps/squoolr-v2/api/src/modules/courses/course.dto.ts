import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { QueryParamsDto } from '../modules.dto';
import { IsOptional, IsString } from 'class-validator';

export class CourseClassroom {
  @ApiProperty()
  classroom_acronym: string;

  constructor(props: CourseClassroom) {
    Object.assign(this, props);
  }
}

export class CourseEntity {
  @ApiProperty()
  annual_subject_id: string;

  @ApiProperty()
  subject_code: string;

  @ApiProperty()
  subject_name: string;

  @ApiProperty({ nullable: true })
  objective: string | null;

  @ApiProperty({ type: [CourseClassroom] })
  classrooms: CourseClassroom[];

  constructor(props: CourseEntity) {
    Object.assign(this, props);
  }
}

export class QueryCourseDto extends QueryParamsDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  annual_subject_id?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  chapter_parent_id?: string;
}
