import { ApiProperty, PartialType } from '@nestjs/swagger';
import { EvaluationTypeEnum } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsEnum,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class WeightingPutDto {
  @IsUUID()
  @ApiProperty()
  cycle_id: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  @ApiProperty()
  weighting_system: number;
}

export class GradeWeightingPostDto {
  @Min(0)
  @IsNumber()
  @ApiProperty()
  minimum: number;

  @Min(0)
  @IsNumber()
  @ApiProperty()
  maximum: number;

  @Min(0)
  @IsNumber()
  @ApiProperty()
  point: number;

  @IsUUID()
  @ApiProperty()
  grade_id: string;

  @IsUUID()
  @ApiProperty()
  cycle_id: string;

  @IsString()
  @ApiProperty()
  observation: string;
}

export class GradeWeightingPutDto extends PartialType(GradeWeightingPostDto) {}

export class AcademicProfilePostDto {
  @IsNumber()
  @Min(0)
  @Max(10)
  @ApiProperty()
  minimum_score: number;

  @IsNumber()
  @Min(0)
  @Max(10)
  @ApiProperty()
  maximum_score: number;

  @IsString()
  @ApiProperty()
  comment: string;
}

export class AcademicProfilePutDto extends PartialType(
  AcademicProfilePostDto
) {}

export class EvaluationTypeWeighting {
  @ApiProperty()
  @IsEnum(EvaluationTypeEnum)
  evaluation_type: EvaluationTypeEnum;

  @Min(0)
  @Max(100)
  @IsNumber()
  @ApiProperty()
  weight: number;
}
export class EvaluationTypeWeightingPutDto {
  @IsNumber()
  @ApiProperty()
  minimum_modulation_score: number;

  @ApiProperty()
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => EvaluationTypeWeighting)
  evaluationTypeWeightings: EvaluationTypeWeighting[];
}

export class SemesterExamAccess {
  @Min(1)
  @Max(2)
  @IsNumber()
  @ApiProperty()
  annual_sesmeter_number: number;

  @Min(0)
  @Max(100)
  @IsNumber()
  @ApiProperty()
  payment_percentage: number;
}
export class SemesterExamAccessPutDto {
  @ApiProperty()
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => SemesterExamAccess)
  semesterExamAccess: SemesterExamAccess[];
}
