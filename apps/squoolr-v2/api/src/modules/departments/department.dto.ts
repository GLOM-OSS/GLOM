import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @ApiProperty()
  department_name: string;

  @IsString()
  @ApiProperty()
  department_acronym: string;
}
export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  department_name?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  is_deleted?: boolean;
}
