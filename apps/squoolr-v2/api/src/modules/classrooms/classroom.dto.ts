import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AnnualClassroom } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { QueryParamsDto } from '../modules.dto';

export class UpdateClassroomDto {
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  registration_fee?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  total_fee_due?: number;
}

export class ClassroomDivisionQueryDto {
  @IsString()
  @ApiProperty()
  annual_classroom_id: string;
}

export class QueryClassroomDto extends QueryParamsDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty()
  annual_major_id: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  level?: number;
}

export class AnnualClassroomEntity implements AnnualClassroom {
  @ApiProperty()
  annual_classroom_id: string;

  @ApiProperty()
  annual_major_id: string;

  @ApiProperty()
  classroom_name: string;

  @ApiProperty()
  classroom_code: string;

  @ApiProperty()
  classroom_acronym: string;

  @ApiProperty()
  classroom_level: number;

  @ApiProperty()
  number_of_divisions: number;

  @ApiProperty()
  is_deleted: boolean;

  @ApiProperty({ nullable: true })
  total_fee_due: number | null;

  @ApiProperty({ nullable: true })
  registration_fee: number | null;

  @ApiProperty({ nullable: true })
  annual_coordinator_id: string | null;

  @ApiProperty()
  classroom_id: string;

  @ApiProperty()
  created_at: Date;

  constructor(props: AnnualClassroomEntity) {
    Object.assign(this, props);
  }
}
