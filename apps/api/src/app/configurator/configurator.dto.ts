import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID, ValidateNested
} from 'class-validator';

export class DepartmentPostDto {
  @IsString()
  @ApiProperty()
  department_name: string;

  @IsString()
  @ApiProperty()
  department_acronym: string;
}
export class DepartmentPutDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  department_name?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  is_deleted?: boolean;
}

export class DepartmentQueryDto {
  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  archived?: boolean;
}

export class ClassroomPost {
  @IsNumber()
  @ApiProperty()
  level: number;

  @IsNumber()
  @ApiProperty()
  total_fees_due: number;

  @IsNumber()
  @ApiProperty()
  registration_fee: number;
}
export class MajorPostDto {
  @IsString()
  @ApiProperty()
  major_name: string;

  @IsString()
  @ApiProperty()
  major_acronym: string;

  @IsString()
  @ApiProperty()
  department_code: string;

  @IsUUID()
  @ApiProperty()
  cycle_id: string;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => ClassroomPost)
  classrooms: ClassroomPost[];
}

export class AnnualMajorPutDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  major_name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  major_acronym?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  department_code?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  is_deleted?: boolean;
}

export class MajorQueryDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  department_id?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  academic_year_id?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  archived?: boolean;
}

export class ClassroomPutDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  registration_fee: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  total_fees_due: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  is_deleted?: boolean;
}
