import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Assessment, SubmissionType } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class QueryAssessmentDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  annual_subject_id?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  chapter_id?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  is_assignment?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  is_published?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  is_deleted: boolean;
}

export class CreateAssessmentDto {
  @IsBoolean()
  @ApiProperty()
  is_assignment: boolean;

  @IsString()
  @ApiProperty()
  annual_subject_id: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  chapter_id: string;
}

export class AssessmentEntity implements Assessment {
  @ApiProperty()
  assessment_id: string;

  @ApiProperty()
  assessment_name: string;

  @ApiProperty({ nullable: true })
  assessment_date: Date;

  @ApiProperty({ description: 'duration in milliseconds' })
  duration: number;

  @ApiProperty()
  is_assignment: boolean;

  @ApiProperty()
  is_published: boolean;

  @ApiProperty()
  is_deleted: boolean;

  @ApiProperty({ default: 1 })
  number_per_group: number;

  @ApiProperty({ default: SubmissionType.Individual, enum: SubmissionType })
  submission_type: SubmissionType;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  annual_subject_id: string;

  @ApiProperty({ nullable: true })
  chapter_id: string;

  @ApiProperty({ nullable: true })
  evaluation_id: string;

  @Exclude()
  @ApiHideProperty()
  created_by: string;

  constructor(props: AssessmentEntity) {
    Object.assign(this, props);
  }
}
