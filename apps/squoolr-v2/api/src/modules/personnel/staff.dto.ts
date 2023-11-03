import {
  ApiProperty,
  ApiPropertyOptional
} from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional
} from 'class-validator';
import { Role } from '../../app/auth/auth.decorator';
import { QueryParamsDto } from '../modules.dto';
import { StaffIDs } from './staff';


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
  last_connected: Date | null;

  @ApiPropertyOptional()
  annual_configurator_id?: string;

  @ApiPropertyOptional()
  annual_registry_id?: string;

  @ApiPropertyOptional()
  annual_teacher_id?: string;

  @ApiPropertyOptional()
  annual_coordinator_id?: string;

  @ApiProperty({ enum: Role, isArray: true })
  roles: Role[];

  constructor(props: StaffEntity) {
    Object.assign(this, props);
  }
}

export class QueryStaffDto extends QueryParamsDto {
  @IsEnum(Role)
  @IsOptional()
  @ApiPropertyOptional({ enum: Role })
  roles?: Role;
}
