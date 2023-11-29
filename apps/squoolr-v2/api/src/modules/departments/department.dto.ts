import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Department } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @ApiProperty()
  department_name: string;

  @IsString()
  @ApiProperty()
  department_acronym: string;
}
export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}

export class DepartmentEntity implements Department {
  @ApiProperty()
  department_id: string;

  @ApiProperty()
  department_name: string;

  @ApiProperty()
  department_acronym: string;

  @Exclude()
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
    Object.entries(props).forEach(([key, value]) => {
      if (key in this) this[key] = value;
    });
  }
}

export class DisableDepartmentsDto {
  @IsString({ each: true })
  @ApiProperty({ type: [String] })
  departmentIds: string[];
}
