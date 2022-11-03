import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail, IsNotEmptyObject,
  IsOptional,
  IsPhoneNumber,
  IsString, registerDecorator,
  ValidateNested,
  ValidationOptions
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
  @ApiProperty()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => PersonPostDto)
  personnel: PersonPostDto;
  
  @ApiProperty()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => SchoolPostDto)
  school: SchoolPostDto;
}

export function IsValidSubdomain(validationOptions?: ValidationOptions) {
  return (subdomain, propertyName: string) => {
    registerDecorator({
      name: 'IsValidSubdomain',
      target: subdomain.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value) {
          return typeof value === 'string' && !value.includes('squoolr.com');
        },
      },
    });
  };
}

export class DemandValidateDto {
  @ApiProperty()
  @IsString()
  school_code: string;

  @ApiProperty()
  @IsOptional()
  rejection_reason?: string;

  @ApiProperty()
  @IsOptional()
  @IsValidSubdomain()
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
