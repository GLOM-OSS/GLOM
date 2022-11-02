import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { IsDateString, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class AcademicYearQueryDto {
  @ApiProperty()
  @IsString()
  academic_year_id: string;
}

export class PersonPostDto {
  @ApiProperty()
  @IsString()
  first_name: string;

  @ApiProperty()
  @IsString()
  last_name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  phone_number: string;

  @ApiProperty()
  @IsDateString()
  birthdate: Date;

  @ApiProperty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty()
  @IsString()
  national_id_number: string;

  @ApiProperty()
  @IsString()
  password: string;
}
