import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

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
  @ApiPropertyOptional()
  department_name?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  is_deleted?: boolean;
}
