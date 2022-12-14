import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class CreditUnitQuery {
  @IsUUID()
  @IsOptional()
  @ApiProperty({ required: false })
  major_id?: string;

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

  @ApiProperty()
  @IsNumber()
  number_of_hours: number;
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

  @ApiProperty()
  @IsNumber()
  weighting: number;

  @ApiProperty()
  @ArrayMinSize(1)
  @Type(() => SubjectPart)
  @ValidateNested({ each: true })
  subjectParts: SubjectPart[];
}
