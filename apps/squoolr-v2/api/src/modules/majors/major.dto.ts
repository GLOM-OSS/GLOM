import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { CycleEntity, QueryParamsDto } from '../modules.dto';
import { Exclude } from 'class-transformer';

export class CreateMajorDto {
  @IsString()
  @ApiProperty()
  major_name: string;

  @IsString()
  @ApiProperty()
  major_acronym: string;

  @IsUUID()
  @ApiProperty()
  department_id: string;

  @IsUUID()
  @ApiProperty()
  cycle_id: string;

  constructor(props: CreateMajorDto) {
    Object.assign(this, props);
  }
}

export class UpdateMajorDto extends OmitType(PartialType(CreateMajorDto), [
  'cycle_id',
  'department_id',
]) {}

export class QueryMajorDto extends QueryParamsDto {
  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional()
  department_id?: string;
}

export class AnnualMajorEntity extends OmitType(CreateMajorDto, ['cycle_id']) {
  @ApiProperty()
  annual_major_id: string;

  @ApiProperty()
  major_id: string;

  @ApiProperty()
  department_acronym: string;

  @ApiProperty({ type: CycleEntity })
  cycle: CycleEntity;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  is_deleted: boolean;

  constructor(props: AnnualMajorEntity) {
    super(props);
    Object.assign(this, props);
  }
}
