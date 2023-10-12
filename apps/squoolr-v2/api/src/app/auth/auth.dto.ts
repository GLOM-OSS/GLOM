import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import {
  CivilStatusEnum,
  EmploymentStatus,
  Gender,
  Lang,
  Person,
} from '@prisma/client';
import { Exclude } from 'class-transformer';
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

  constructor(props: PersonPostDto) {
    Object.assign(this, props);
  }
}

export class PersonEntity
  extends OmitType(PersonPostDto, ['password'])
  implements Person
{
  @ApiProperty({ nullable: true })
  address: string | null;

  @ApiProperty()
  person_id: string;

  @ApiProperty()
  birthplace: string;

  @ApiProperty()
  nationality: string;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  latitude: number;

  @ApiProperty({ enum: Lang })
  preferred_lang: Lang;

  @ApiProperty()
  image_ref: string;

  @ApiProperty()
  home_region: string;

  @ApiProperty()
  religion: string;

  @ApiProperty()
  handicap: string;

  @ApiProperty({ enum: CivilStatusEnum })
  civil_status: CivilStatusEnum;

  @ApiProperty({ enum: EmploymentStatus })
  employment_status: EmploymentStatus;

  @ApiProperty()
  created_at: Date;

  constructor(props: PersonEntity) {
    super(props);
    Object.assign(this, props);
  }
}
