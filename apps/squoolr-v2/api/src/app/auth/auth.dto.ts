import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import {
  CivilStatusEnum,
  EmploymentStatus,
  Gender,
  Lang,
  Person,
} from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class SetNewPasswordDto {
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

export class CreatePersonDto {
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
  @Transform(({ value }) => new Date(value))
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

  constructor(props: CreatePersonDto) {
    Object.assign(this, props);
  }
}

export class PersonEntity
  extends OmitType(CreatePersonDto, ['password'])
  implements Person
{
  @ApiProperty({ nullable: true })
  address: string | null;

  @ApiProperty()
  person_id: string;

  @ApiProperty({ nullable: true })
  birthplace: string | null;

  @ApiProperty()
  nationality: string;

  @ApiProperty({ nullable: true })
  longitude: number | null;

  @ApiProperty({ nullable: true })
  latitude: number | null;

  @ApiProperty({ enum: Lang })
  preferred_lang: Lang;

  @ApiProperty({ nullable: true })
  image_ref: string | null;

  @ApiProperty({ nullable: true })
  home_region: string | null;

  @ApiProperty({ nullable: true })
  religion: string | null;

  @ApiProperty()
  handicap: string;

  @ApiProperty({ enum: CivilStatusEnum })
  civil_status: CivilStatusEnum;

  @ApiProperty({ enum: EmploymentStatus, nullable: true })
  employment_status: EmploymentStatus | null;

  @ApiProperty()
  @Transform(({ value }) => new Date(value))
  created_at: Date;

  constructor(props: PersonEntity) {
    super(props);
    Object.assign(this, props);
  }
}
