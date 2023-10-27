import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Department } from '@prisma/client';
import { Exclude } from 'class-transformer';
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

export class DepartmentEntity implements Department {
  @ApiProperty()
  department_id: string;

  @ApiProperty()
  department_name: string;

  @ApiProperty()
  department_acronym: string;

  @ApiProperty()
  department_code: string;

  @ApiProperty()
  created_at: Date;

  @Exclude()
  @ApiProperty()
  created_by: string;

  @Exclude()
  @ApiProperty()
  school_id: string;

  @Exclude()
  @ApiProperty()
  is_deleted: boolean;

  constructor(props: DepartmentEntity) {
    Object.assign(this, props);
  }
}
