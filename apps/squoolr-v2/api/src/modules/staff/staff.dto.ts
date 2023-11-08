import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { QueryParamsDto } from '../modules.dto';
import { StaffIDs } from './staff';
import { Gender } from '@prisma/client';
import { StaffRole } from '../../utils/enums';
import { CreatePersonDto } from '../../app/auth/auth.dto';
import { Type } from 'class-transformer';

export class QueryStaffDto extends QueryParamsDto {
  @IsOptional()
  @IsEnum(StaffRole, { each: true })
  @ApiPropertyOptional({ enum: StaffRole, isArray: true })
  roles?: StaffRole[];
}

export class StaffRoleDto {
  @IsEnum(StaffRole)
  @ApiProperty({ enum: StaffRole })
  role: StaffRole;
}

export class QueryOneStaffDto extends StaffRoleDto {}

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

export class CreateConfiguratorDto extends OmitType(CreatePersonDto, [
  'password',
]) {
  @IsEnum(StaffRole)
  @ApiProperty({ enum: StaffRole })
  role: StaffRole;
}

export class CreateCoordinatorDto extends StaffRoleDto {
  @IsString()
  @ApiProperty()
  annual_teacher_id: string;

  @IsString({ each: true })
  @ApiProperty({ type: [String] })
  annualClassroomIds: string[];
}

export class CreateTeacherDto extends CreateConfiguratorDto {
  @IsUUID()
  @ApiProperty()
  teaching_grade_id: string;

  @IsUUID()
  @ApiProperty()
  teacher_type_id: string;

  @IsString()
  @ApiProperty()
  origin_institute: string;

  @IsNumber()
  @ApiProperty()
  hourly_rate: number;

  @IsBoolean()
  @ApiProperty()
  has_signed_convention: boolean;

  @IsBoolean()
  @ApiProperty()
  has_tax_payers_card: boolean;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  tax_payer_card_number?: string;
}

export class CreateStaffDto {
  @Type(() => StaffRoleDto, {
    discriminator: {
      property: 'role',
      subTypes: [
        {
          value: CreateConfiguratorDto,
          name: StaffRole.CONFIGURATOR,
        },
        {
          value: CreateConfiguratorDto,
          name: StaffRole.REGISTRY,
        },
        {
          value: CreateCoordinatorDto,
          name: StaffRole.COORDINATOR,
        },
        {
          value: CreateTeacherDto,
          name: StaffRole.TEACHER,
        },
      ],
    },
  })
  @ApiProperty({ type: StaffRoleDto })
  payload: CreateConfiguratorDto | CreateCoordinatorDto | CreateTeacherDto;
}

export class UpdateConfiguratorDto extends PartialType(CreateConfiguratorDto) {}
export class UpdateCoordinatorDto extends OmitType(CreateCoordinatorDto, [
  'annual_teacher_id',
]) {}

export class UpdateTeacherDto extends PartialType(CreateTeacherDto) {}

export class UpdateStaffDto {
  @Type(() => StaffRoleDto, {
    discriminator: {
      property: 'role',
      subTypes: [
        {
          value: UpdateConfiguratorDto,
          name: StaffRole.CONFIGURATOR,
        },
        {
          value: UpdateConfiguratorDto,
          name: StaffRole.REGISTRY,
        },
        {
          value: UpdateCoordinatorDto,
          name: StaffRole.COORDINATOR,
        },
        {
          value: UpdateTeacherDto,
          name: StaffRole.TEACHER,
        },
      ],
    },
  })
  @ApiProperty({ type: StaffRoleDto })
  payload: UpdateConfiguratorDto | UpdateCoordinatorDto | UpdateTeacherDto;
}
