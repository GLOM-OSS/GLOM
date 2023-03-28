import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  ValidateNested,
} from 'class-validator';

export class MajorId {
  @IsUUID()
  @ApiProperty()
  major_id: string;
}

export class CreditUnitQuery {
  @IsOptional()
  @ArrayMinSize(1)
  @Type(() => MajorId)
  @ValidateNested({ each: true })
  @ApiProperty({ type: MajorId, isArray: true, required: false })
  majorIds?: MajorId[];

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  semester_number?: number;
}

export class CreditUnitPostDto {
  @ApiProperty()
  @IsUUID()
  major_id: string;

  @ApiProperty()
  @IsString()
  credit_unit_code: string;

  @ApiProperty()
  @IsString()
  credit_unit_name: string;

  @ApiProperty()
  @IsNumber()
  credit_points: number;

  @ApiProperty()
  @IsNumber()
  semester_number: number;
}

export class CreditUnitPutDto extends PartialType(CreditUnitPostDto) {}

export class SubjectPart {
  @ApiProperty()
  @IsString()
  subject_part_id: string;

  @IsInt()
  @ApiProperty()
  number_of_hours: number;

  @ApiProperty()
  @IsString()
  annual_teacher_id: string;
}

export class CreditUnitSubjectPostDto {
  @ApiProperty()
  @IsString()
  annual_credit_unit_id: string;

  @ApiProperty()
  @IsString()
  subject_title: string;

  @ApiProperty()
  @IsString()
  subject_code: string;

  @ApiProperty()
  @IsString()
  objective: string;

  @Max(1)
  @IsNumber()
  @ApiProperty()
  weighting: number;

  @ArrayMinSize(1)
  @Type(() => SubjectPart)
  @ValidateNested({ each: true })
  @ApiProperty({ type: SubjectPart, isArray: true })
  subjectParts: SubjectPart[];
}

export class CreditUnitSubjectPutDto extends PartialType(
  CreditUnitSubjectPostDto
) {}
