import {
  ApiExtraModels,
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
  getSchemaPath,
} from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreatePersonDto } from '../../app/auth/auth.dto';
import { StaffRole } from '../../utils/enums';
import { QueryParamsDto } from '../modules.dto';
import { StaffIDs } from './staff';

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

  @ApiProperty({ enum: Gender, nullable: null })
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

export class CreatePersonWithRoleDto extends OmitType(CreatePersonDto, [
  'password',
]) {
  @IsEnum(StaffRole)
  @ApiProperty({ enum: StaffRole })
  role: StaffRole;
}

export class CreateConfiguratorDto extends CreatePersonWithRoleDto {
  @IsEnum([StaffRole.CONFIGURATOR])
  @ApiProperty({ enum: [StaffRole.CONFIGURATOR] })
  role: StaffRole.CONFIGURATOR;
}
export class CreateRegistryDto extends CreatePersonWithRoleDto {
  @IsEnum([StaffRole.REGISTRY])
  @ApiProperty({ enum: [StaffRole.REGISTRY] })
  role: StaffRole.REGISTRY;
}

export class CreateCoordinatorDto extends StaffRoleDto {
  @IsEnum([StaffRole.COORDINATOR])
  @ApiProperty({ enum: [StaffRole.COORDINATOR] })
  role: StaffRole.COORDINATOR;

  @IsString()
  @ApiProperty()
  annual_teacher_id: string;

  @IsString({ each: true })
  @ApiProperty({ type: [String] })
  annualClassroomIds: string[];
}

export class CreateTeacherDto extends CreatePersonWithRoleDto {
  @IsEnum([StaffRole.TEACHER])
  @ApiProperty({ enum: [StaffRole.TEACHER] })
  role: StaffRole.TEACHER;

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

export class UpdateConfiguratorDto extends IntersectionType(
  CreateConfiguratorDto,
  PartialType(OmitType(CreateConfiguratorDto, ['role']))
) {}
export class UpdateRegistryDto extends IntersectionType(
  CreateRegistryDto,
  PartialType(OmitType(CreateRegistryDto, ['role']))
) {}
export class UpdateCoordinatorDto extends OmitType(CreateCoordinatorDto, [
  'annual_teacher_id',
]) {}
export class UpdateTeacherDto extends IntersectionType(
  CreateTeacherDto,
  PartialType(OmitType(CreateTeacherDto, ['role']))
) {}

const getStaffSubTypes = (action: 'create' | 'update') => [
  {
    value: action === 'create' ? CreateConfiguratorDto : UpdateConfiguratorDto,
    name: StaffRole.CONFIGURATOR,
  },
  {
    value: action === 'create' ? CreateRegistryDto : UpdateRegistryDto,
    name: StaffRole.REGISTRY,
  },
  {
    value: action === 'create' ? CreateCoordinatorDto : UpdateCoordinatorDto,
    name: StaffRole.COORDINATOR,
  },
  {
    value: action === 'create' ? CreateTeacherDto : UpdateTeacherDto,
    name: StaffRole.TEACHER,
  },
];

export type CreateStaffPayloadDto =
  | CreateConfiguratorDto
  | CreateCoordinatorDto
  | CreateTeacherDto;
@ApiExtraModels(
  CreateConfiguratorDto,
  CreateRegistryDto,
  CreateCoordinatorDto,
  CreateTeacherDto
)
export class CreateStaffDto {
  @ValidateNested()
  @Type(() => StaffRoleDto, {
    discriminator: {
      property: 'role',
      subTypes: getStaffSubTypes('create'),
    },
    keepDiscriminatorProperty: true,
  })
  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(CreateConfiguratorDto) },
      { $ref: getSchemaPath(CreateRegistryDto) },
      { $ref: getSchemaPath(CreateCoordinatorDto) },
      { $ref: getSchemaPath(CreateTeacherDto) },
    ],
  })
  payload: CreateStaffPayloadDto;
}

export type UpdateStaffPayloadDto =
  | UpdateConfiguratorDto
  | UpdateCoordinatorDto
  | UpdateTeacherDto;
@ApiExtraModels(
  UpdateConfiguratorDto,
  UpdateRegistryDto,
  UpdateCoordinatorDto,
  UpdateTeacherDto
)
export class UpdateStaffDto {
  @Type(() => StaffRoleDto, {
    discriminator: {
      property: 'role',
      subTypes: getStaffSubTypes('update'),
    },
    keepDiscriminatorProperty: true,
  })
  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(UpdateConfiguratorDto) },
      { $ref: getSchemaPath(UpdateRegistryDto) },
      { $ref: getSchemaPath(UpdateCoordinatorDto) },
      { $ref: getSchemaPath(UpdateTeacherDto) },
    ],
  })
  payload: UpdateStaffPayloadDto;
}

export class ManageStaffDto {
  @ApiProperty()
  @IsString({ each: true })
  teacherIds: string[];

  @ApiProperty()
  @IsString({ each: true })
  registryIds: string[];

  @ApiProperty()
  @IsString({ each: true })
  configuratorIds: string[];
}

export class CoordinateClassDto extends OmitType(UpdateCoordinatorDto, [
  'role',
]) {}

export class UpdateStaffRoleDto {
  @IsEnum(StaffRole, { each: true })
  @ApiProperty({ enum: [StaffRole] })
  newRoles: StaffRole[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ManageStaffDto)
  @ApiPropertyOptional({ type: ManageStaffDto })
  disabledStaffPayload?: ManageStaffDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CoordinateClassDto)
  @ApiPropertyOptional({ type: CoordinateClassDto })
  coordinatorPayload?: UpdateCoordinatorDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateTeacherDto)
  @ApiPropertyOptional({ type: UpdateTeacherDto })
  teacherPayload?: UpdateTeacherDto;
}
