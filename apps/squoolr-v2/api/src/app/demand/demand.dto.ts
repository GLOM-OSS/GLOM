import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { SchoolDemandStatus } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  NotContains,
  ValidateNested,
} from 'class-validator';
import { CreatePersonDto, PersonEntity } from '../auth/auth.dto';

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

  @ApiProperty()
  @Transform(({ value }) => new Date(value))
  @IsDateString()
  initial_year_starts_at: Date;

  @ApiProperty()
  @Transform(({ value }) => new Date(value))
  @IsDateString()
  initial_year_ends_at: Date;

  constructor(props: CreateSchoolDto) {
    Object.assign(this, props);
  }
}

export class SubmitDemandDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  payment_phone?: string;

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

export class ValidateDemandDto {
  @ApiProperty()
  @IsString()
  school_code: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  rejection_reason?: string;

  @IsOptional()
  @ApiPropertyOptional()
  @NotContains('squoolr.com')
  subdomain?: string;
}

export class SchoolEntity extends OmitType(CreateSchoolDto, [
  'referral_code',
  'initial_year_ends_at',
  'initial_year_starts_at',
]) {
  @IsNumber()
  @ApiProperty()
  paid_amount: number;

  @ApiProperty()
  ambassador_email: string;

  @ApiProperty()
  school_code: string;

  @ApiProperty({ enum: SchoolDemandStatus })
  school_demand_status: SchoolDemandStatus;

  @ApiProperty()
  school_rejection_reason: string;

  constructor(props: SchoolEntity) {
    super(props);
    Object.assign(this, props);
  }
}

export class DemandDetails {
  @ApiProperty({ type: SchoolEntity })
  @Transform(({ value }) => new SchoolEntity(value))
  school: SchoolEntity;

  @ApiProperty({ type: PersonEntity })
  @Transform(({ value }) => new PersonEntity(value))
  person: PersonEntity;

  constructor(props: DemandDetails) {
    Object.assign(this, props);
  }
}
