import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID, Max, Min } from 'class-validator';

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
