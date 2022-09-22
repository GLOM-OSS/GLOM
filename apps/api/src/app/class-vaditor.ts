import { Gender } from '@prisma/client';
import { IsDateString, IsEmail, IsEnum, IsString } from 'class-validator';

export class AcademicYearQueryDto {
  @IsString()
  academic_year_id: string
}

export class PersonPostDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsDateString()
  birthdate: Date;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  national_id_number: string;

  @IsString()
  password: string;
}