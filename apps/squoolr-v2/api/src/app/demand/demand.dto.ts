import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Exclude, Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmptyObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  NotContains,
  ValidateNested,
} from 'class-validator';
import { PersonEntity, PersonPostDto } from '../auth/auth.dto';
import { SchoolDemandStatus } from '@prisma/client';

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

  @ApiProperty()
  @IsPhoneNumber('CM')
  school_phone_number: string;

  @ApiProperty()
  @IsDateString()
  initial_year_starts_at: Date;

  @ApiProperty()
  @IsDateString()
  initial_year_ends_at: Date;

  constructor(props: CreateSchoolDto) {
    Object.assign(this, props);
  }
}

export class SubmitDemandDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => PersonPostDto)
  @ApiProperty({ type: PersonPostDto })
  personnel: PersonPostDto;

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

  @IsOptional()
  @ApiPropertyOptional()
  rejection_reason?: string;

  @IsOptional()
  @ApiPropertyOptional()
  @NotContains('squoolr.com')
  subdomain?: string;
}

export class SchoolEntity extends OmitType(CreateSchoolDto, [
  'school_acronym',
  'initial_year_ends_at',
  'initial_year_starts_at',
]) {
  @ApiProperty()
  school_code: string;

  @ApiProperty({ enum: SchoolDemandStatus })
  school_demand_status: SchoolDemandStatus;

  @ApiProperty()
  school_rejection_reason: string;

  constructor(props: SchoolEntity) {
    super();
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
