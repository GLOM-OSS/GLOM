import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

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

  @IsString()
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

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  is_class_generated: boolean
}

export class AnnualMajorPutDto {
  @IsString()
  @ApiProperty()
  major_name?: string;

  @IsString()
  @ApiProperty()
  major_acronym?: string;

  @IsString()
  @ApiProperty()
  department_code?: string;
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
