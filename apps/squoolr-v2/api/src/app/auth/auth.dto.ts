import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PickType,
} from '@nestjs/swagger';
import {
  CivilStatusEnum,
  EmploymentStatus,
  Gender,
  Lang,
  Person,
} from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { AcademicYearEntity } from '../../modules/academic-years/academic-years.dto';
import { Role } from '../../utils/enums';

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

  @IsDate()
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  birthdate: Date | null;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender: Gender | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  national_id_number: string | null;

  @ApiProperty()
  @IsStrongPassword()
  password: string;

  constructor(props: CreatePersonDto) {
    Object.entries(props).forEach(([key, value]) => {
      if (key in this) this[key] = value;
    });
  }
}

export class PersonEntity
  extends OmitType(CreatePersonDto, ['password'])
  implements Person
{
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
    Object.entries(props).forEach(([key, value]) => {
      if (key in this) this[key] = value;
    });
  }
}

export class UserEntity extends PersonEntity {
  @ApiPropertyOptional()
  active_year_id?: string;

  @ApiProperty({ enum: Role, isArray: true })
  roles: Role[];

  constructor(props: UserEntity) {
    super(props);
    Object.entries(props).forEach(([key, value]) => {
      if (key in this) this[key] = value;
    });
  }
}

export class UserAnnualRoles extends PickType(UserEntity, [
  'active_year_id',
  'roles',
]) {
  constructor(props: UserAnnualRoles) {
    super(props);
    Object.entries(props).forEach(([key, value]) => {
      if (key in this) this[key] = value;
    });
  }
}

export class SingInResponse {
  @ApiProperty({ type: UserEntity })
  user: UserEntity;

  @ApiPropertyOptional({ type: [AcademicYearEntity] })
  academicYears?: AcademicYearEntity[];

  constructor(props: SingInResponse) {
    Object.entries(props).forEach(([key, value]) => {
      if (key in this) this[key] = value;
    });
  }
}
