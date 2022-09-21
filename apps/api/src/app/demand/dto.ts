import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsNotEmptyObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  registerDecorator, ValidateNested,
  ValidationOptions
} from 'class-validator';
import { PersonPostData } from '../class-vaditor';

export class SchoolPostData {
  @IsString()
  school_name: string;

  @IsString()
  school_acronym: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber('CM')
  phone: string;

  @IsDateString()
  initial_year_starts_at: Date;

  @IsDateString()
  initial_year_ends_at: Date;
}

export class DemandPostData {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => PersonPostData)
  personnel: PersonPostData;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => SchoolPostData)
  school: SchoolPostData;
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
          return typeof value === 'string' && value.endsWith('squoolr.com');
        },
      },
    });
  };
}

export class ValidateDemandDto {
  @IsUUID()
  school_demand_id: string;

  @IsOptional()
  rejection_reason?: string;

  @IsOptional()
  @IsValidSubdomain()
  subdomain?: string;
}
