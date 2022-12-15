import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class WeightingPutDto {
  @IsUUID()
  @ApiProperty()
  cycle_id: string;

  @IsNumber()
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
