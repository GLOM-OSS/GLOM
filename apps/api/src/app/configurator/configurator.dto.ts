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

export class DepartmentQueryDto {
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  archived?: boolean;
}

export class MajorPostDto {
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
  cyle_id: string;
}
