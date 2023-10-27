import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CycleEntity, QueryParamsDto } from '../modules.dto';
import { DepartmentEntity } from '../departments/department.dto';
import { Cycle } from '@prisma/client';

export class CreateMajorClassroomDto {
  @IsNumber()
  @ApiProperty()
  level: number;

  @IsNumber()
  @ApiProperty()
  total_fee_due: number;

  @IsNumber()
  @ApiProperty()
  registration_fee: number;
}
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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMajorClassroomDto)
  @ApiProperty({ type: [CreateMajorClassroomDto] })
  classrooms: CreateMajorClassroomDto[];
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

export class AnnualMajorEntity extends OmitType(CreateMajorDto, [
  'classrooms',
]) {
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
