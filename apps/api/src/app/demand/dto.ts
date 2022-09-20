import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail, IsNotEmptyObject,
  IsPhoneNumber,
  IsString,
  ValidateNested
} from 'class-validator';
import { PersonPostData } from '../class-vaditor';

export class SchoolPostData {
  @IsString()
  school_name: string;

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
