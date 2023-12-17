import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import {
  AnnualDocumentSigner,
  AnnualSchoolSetting,
  MarkInsertionSource,
  School,
  SchoolDemandStatus,
} from '@prisma/client';
import { Exclude, Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmptyObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  NotContains,
  ValidateNested,
} from 'class-validator';
import { CreatePersonDto, PersonEntity } from '../../app/auth/auth.dto';
import { CreateAcademicYearDto } from '../academic-years/academic-years.dto';
import { QueryParamsDto } from '../modules.dto';

export class QuerySchoolDto extends QueryParamsDto {
  @IsOptional()
  @IsEnum(SchoolDemandStatus, { each: true })
  @ApiPropertyOptional({ enum: SchoolDemandStatus, isArray: true })
  schoolDemandStatus?: SchoolDemandStatus[];
}

export class CreateSchoolDto {
  @ApiProperty()
  @IsString()
  school_name: string;

  @ApiProperty()
  @IsString()
  school_acronym: string;

  @ApiProperty()
  @IsEmail()
  school_email: string;

  @IsString()
  @ApiProperty()
  lead_funnel: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  referral_code?: string;

  @ApiProperty()
  @IsPhoneNumber('CM')
  school_phone_number: string;

  @IsDate()
  @ApiProperty()
  @Transform(({ value }) => new Date(value))
  initial_year_starts_at: Date;

  @IsDate()
  @ApiProperty()
  @Transform(({ value }) => new Date(value))
  initial_year_ends_at: Date;

  constructor(props: CreateSchoolDto) {
    Object.assign(this, props);
  }
}

export class SubmitSchoolDemandDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  payment_id?: string;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreatePersonDto)
  @ApiProperty({ type: CreatePersonDto })
  configurator: CreatePersonDto;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateSchoolDto)
  @ApiProperty({ type: CreateSchoolDto })
  school: CreateSchoolDto;
}

export class ValidateSchoolDemandDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  rejection_reason?: string;

  @IsOptional()
  @ApiPropertyOptional()
  @NotContains('squoolr.com')
  subdomain?: string;
}

export class SchoolEntity
  extends OmitType(CreateSchoolDto, [
    'referral_code',
    'initial_year_ends_at',
    'initial_year_starts_at',
  ])
  implements School
{
  @ApiProperty()
  school_id: string;

  @ApiProperty()
  school_code: string;

  @ApiProperty()
  paid_amount: number;

  @ApiProperty()
  ambassador_email: string;

  @ApiProperty({ enum: SchoolDemandStatus })
  school_demand_status: SchoolDemandStatus;

  @ApiProperty()
  school_rejection_reason: string;

  @ApiProperty({ nullable: true })
  subdomain: string | null;

  @ApiProperty({ nullable: true })
  creation_decree_number: string | null;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty()
  created_at: Date;

  @Exclude()
  @ApiHideProperty()
  created_by: string;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  address: string;

  @ApiProperty()
  logo_ref: string;

  @ApiProperty()
  is_validated: boolean;

  @Exclude()
  @ApiHideProperty()
  validated_at: Date;

  @Exclude()
  @ApiHideProperty()
  validated_by: string;

  @ApiProperty()
  is_deleted: boolean;

  @Exclude()
  @ApiHideProperty()
  deleted_at: Date;

  @Exclude()
  @ApiHideProperty()
  deleted_by: string;

  constructor(props: SchoolEntity) {
    super(props);
    Object.assign(this, props);
  }
}

export class SchoolDemandDetails {
  @ApiProperty({ type: SchoolEntity })
  @Transform(({ value }) => new SchoolEntity(value))
  school: SchoolEntity;

  @ApiProperty({ type: PersonEntity })
  @Transform(({ value }) => new PersonEntity(value))
  person: PersonEntity;

  @ApiProperty({ type: CreateAcademicYearDto })
  @Transform(({ value }) => new CreateAcademicYearDto(value))
  academicYear: CreateAcademicYearDto;

  constructor(props: SchoolDemandDetails) {
    Object.assign(this, props);
  }
}

export class UpdateSchoolDemandStatus {
  @IsEnum(SchoolDemandStatus)
  @ApiProperty({ enum: SchoolDemandStatus })
  school_demand_status: SchoolDemandStatus;

  constructor(props: UpdateSchoolDemandStatus) {
    Object.assign(this, props);
  }
}

export class UpdateSchoolDto extends PartialType(
  PickType(SchoolEntity, [
    'creation_decree_number',
    'description',
    'school_acronym',
    'school_email',
    'address',
    'logo_ref',
    'school_name',
    'school_phone_number',
    'subdomain',
  ])
) {}

export class CreateDocumentSignerDto {
  @ApiProperty({ example: 'Yongua' })
  signer_name: string;

  @ApiProperty({ example: 'The Rector' })
  signer_title: string;

  @ApiProperty({ example: 'Mr, Ms, Dr, etc' })
  honorific: string;

  @ApiProperty()
  hierarchy_level: number;

  constructor(props: CreateDocumentSignerDto) {
    Object.assign(this, props);
  }
}

export class DocumentSignerEntity
  extends CreateDocumentSignerDto
  implements AnnualDocumentSigner
{
  @ApiProperty()
  annual_document_signer_id: string;

  @ApiProperty()
  annual_school_setting_id: string;

  @Exclude()
  @ApiHideProperty()
  is_deleted: boolean;

  @ApiProperty()
  created_at: Date;

  @Exclude()
  @ApiHideProperty()
  created_by: string;

  @Exclude()
  @ApiHideProperty()
  deleted_by: string;

  constructor(props: DocumentSignerEntity) {
    super(props);
    Object.assign(this, props);
  }
}

export class SchoolSettingEntity implements AnnualSchoolSetting {
  @ApiProperty()
  annual_school_setting_id: string;

  @ApiProperty()
  academic_year_id: string;

  @ApiProperty()
  can_pay_fee: boolean;

  @ApiProperty({ enum: MarkInsertionSource })
  mark_insertion_source: MarkInsertionSource;

  @ApiProperty()
  created_at: Date;

  @Exclude()
  @ApiHideProperty()
  created_by: string;

  @ApiProperty({ type: [DocumentSignerEntity] })
  documentSigners: DocumentSignerEntity[];

  constructor(props: SchoolSettingEntity) {
    Object.assign(this, props);
  }
}

export class UpdateSchoolSettingDto extends PickType(
  PartialType(SchoolSettingEntity),
  ['can_pay_fee', 'mark_insertion_source']
) {
  @IsOptional()
  @ApiPropertyOptional()
  @IsString({ each: true })
  deletedSignerIds?: string[];

  @IsOptional()
  @ApiPropertyOptional({ type: CreateDocumentSignerDto })
  @ValidateNested({ each: true })
  @Type(() => CreateDocumentSignerDto)
  newDocumentSigners?: CreateDocumentSignerDto[];
}
