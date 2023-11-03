import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { QueryParamsDto } from '../modules.dto';
import { StaffIDs } from './staff';
import { Gender } from '@prisma/client';
import { StaffRole } from '../../utils/enums';

export class QueryStaffDto extends QueryParamsDto {
  @IsOptional()
  @IsEnum(StaffRole, { each: true })
  @ApiPropertyOptional({ enum: StaffRole, isArray: true })
  roles?: StaffRole[];
}

export class QueryOneStaffDto {
  @IsEnum(StaffRole)
  @ApiProperty({ enum: StaffRole })
  role: StaffRole;
}

export class StaffEntity implements StaffIDs {
  @ApiProperty()
  email: string;

  @ApiProperty()
  login_id: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  phone_number: string;

  @ApiProperty()
  matricule: string;

  @ApiProperty({ nullable: null })
  national_id_number: string;

  @ApiProperty({ nullable: null })
  birthdate: Date;

  @ApiProperty({ nullable: null })
  address: string;

  @ApiProperty({ nullable: null })
  gender: Gender;

  @ApiProperty({ nullable: null })
  last_connected: Date;

  @ApiPropertyOptional()
  annual_configurator_id?: string;

  @ApiPropertyOptional()
  annual_registry_id?: string;

  @ApiPropertyOptional()
  annual_teacher_id?: string;

  @ApiPropertyOptional()
  annual_coordinator_id?: string;

  @ApiProperty({ enum: StaffRole, isArray: true })
  roles: StaffRole[];

  constructor(props: StaffEntity) {
    Object.assign(this, props);
  }
}
