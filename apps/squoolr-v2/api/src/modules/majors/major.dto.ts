import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { CycleEntity, QueryParamsDto } from '../modules.dto';

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
    Object.entries(props).forEach(([key, value]) => {
      if (key in this) this[key] = value;
    });
  }
}

export class UpdateMajorDto extends OmitType(PartialType(CreateMajorDto), [
  'cycle_id',
  'department_id',
]) {}

export class QueryMajorDto extends QueryParamsDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  department_id?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  uses_module_system?: boolean;
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
  uses_module_system: boolean;

  @ApiProperty()
  is_deleted: boolean;

  constructor(props: AnnualMajorEntity) {
    super(props);
    Object.entries(props).forEach(([key, value]) => {
      if (key in this) this[key] = value;
    });
  }
}

export class DisableMajorsDto {
  @IsString({ each: true })
  @ApiProperty({ type: [String] })
  annualMajorIds: string[];
}
