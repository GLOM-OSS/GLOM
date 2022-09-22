import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsNotEmptyObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  registerDecorator,
  ValidateNested,
  ValidationOptions,
} from 'class-validator';
import { PersonPostDto } from '../class-vaditor';

export class SchoolPostDto {
  @IsString()
  school_name: string;

  @IsString()
  school_acronym: string;

  @IsEmail()
  school_email: string;

  @IsPhoneNumber('CM')
  school_phone_number: string;

  @IsDateString()
  initial_year_starts_at: Date;

  @IsDateString()
  initial_year_ends_at: Date;
}

export class DemandPostData {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => PersonPostDto)
  personnel: PersonPostDto;

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
  @IsUUID()
  school_demand_id: string;

  @IsOptional()
  rejection_reason?: string;

  @IsOptional()
  @IsValidSubdomain()
  subdomain?: string;
}

export class DemandQueryDto {
  @IsUUID()
  school_demand_id: string;
}

export class DemandStatusQueryDto {
  @IsString()
  school_demand_code: string;
}
