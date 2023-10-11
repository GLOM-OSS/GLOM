import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class NewPasswordDto {
  @ApiProperty()
  @IsString()
  reset_password_id: string;

  @ApiProperty()
  @IsString()
  new_password: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}

export class SignInDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
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

  @IsEnum(Gender)
  @ApiProperty({ enum: Gender })
  gender: Gender;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  address?: string;

  @ApiProperty()
  @IsString()
  national_id_number: string;

  @ApiProperty()
  @IsStrongPassword()
  password: string;

  @IsString()
  @ApiProperty()
  lead_funnel: string;
}
