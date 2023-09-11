import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsNotEmptyObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  NotContains,
  ValidateNested,
} from 'class-validator';
import { PersonPostDto } from '../app.dto';

export class SchoolPostDto {
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
}

export class DemandPostDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => PersonPostDto)
  @ApiProperty({ type: PersonPostDto })
  personnel: PersonPostDto;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => SchoolPostDto)
  @ApiProperty({ type: SchoolPostDto })
  school: SchoolPostDto;
}

export class DemandValidateDto {
  @ApiProperty()
  @IsString()
  school_code: string;

  @ApiProperty()
  @IsOptional()
  rejection_reason?: string;

  @IsString()
  @IsOptional()
  @NotContains('squoolr.com')
  @ApiProperty({ required: false })
  subdomain?: string;
}

export class DemandQueryDto {
  @ApiProperty()
  @IsString()
  school_code: string;
}

export class DemandStatusQueryDto {
  @ApiProperty()
  @IsString()
  school_demand_code: string;
}
