import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { QueryParamsDto } from '../modules.dto';

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
]) {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  is_deleted?: boolean;
}

export class QueryMajorDto extends QueryParamsDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  department_code?: string;
}

export class AnnualMajorEntity extends CreateMajorDto {
  @ApiProperty()
  annual_major_id: string;

  @ApiProperty()
  major_id: string;

  @ApiProperty()
  department_acronym: string;

  @ApiProperty()
  cycle_name: string;

  constructor(props: AnnualMajorEntity) {
    super(props);
    Object.assign(this, props);
  }
}
