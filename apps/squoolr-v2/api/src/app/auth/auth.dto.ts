import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PickType,
} from '@nestjs/swagger';
import {
  AcademicYearStatus,
  CivilStatusEnum,
  EmploymentStatus,
  Gender,
  Lang,
  Person,
} from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ActiveYear, DesirializeSession } from './auth';

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

class StudentSessionData {
  @ApiProperty()
  annual_student_id: string;

  @ApiProperty()
  activeSemesters: number[];

  @ApiProperty()
  classroom_code: string;

  @ApiProperty()
  classroom_level: number;

  @ApiProperty()
  student_id: string;

  constructor(props: StudentSessionData) {
    Object.assign(this, props);
  }
}

export class ConfiguratorSessionData {
  @ApiProperty()
  annual_configurator_id: string;

  @ApiProperty()
  is_sudo: boolean;

  constructor(props: ConfiguratorSessionData) {
    Object.assign(this, props);
  }
}

export class TeacherSessionData {
  @ApiProperty()
  annual_teacher_id: string;

  @ApiProperty()
  hourly_rate: number;

  @ApiProperty()
  origin_institute: string;

  @ApiProperty()
  has_signed_convention: boolean;

  @ApiProperty()
  classroomDivisions: string[];

  @ApiProperty()
  teacher_id: string;

  constructor(props: TeacherSessionData) {
    Object.assign(this, props);
  }
}

export class RegistrySessionData {
  @ApiProperty()
  annual_registry_id: string;

  constructor(props: ConfiguratorSessionData) {
    Object.assign(this, props);
  }
}

export class ActiveYearSessionData implements ActiveYear {
  @ApiProperty()
  academic_year_id: string;

  @ApiProperty()
  starting_date: Date;

  @ApiProperty()
  ending_date: Date;

  @ApiProperty({ enum: AcademicYearStatus })
  year_status: AcademicYearStatus;

  @ApiProperty()
  year_code: string;

  constructor(props: ActiveYearSessionData) {
    Object.assign(this, props);
  }
}
export class User extends PersonEntity implements DesirializeSession {
  @ApiProperty()
  login_id: string;

  @ApiProperty()
  school_id?: string;

  @ApiProperty()
  tutorStudentIds?: string[];

  @ApiProperty()
  @Type(() => ActiveYearSessionData)
  @Transform(({ value }) => new ActiveYearSessionData(value))
  activeYear?: ActiveYearSessionData;

  @ApiProperty()
  @Type(() => StudentSessionData)
  @Transform(({ value }) => new StudentSessionData(value))
  annualStudent?: StudentSessionData;

  @Type(() => ConfiguratorSessionData)
  annualConfigurator?: ConfiguratorSessionData;

  @Type(() => TeacherSessionData)
  @Transform(({ value }) => new TeacherSessionData(value))
  annualTeacher?: TeacherSessionData;

  @Type(() => RegistrySessionData)
  @Transform(({ value }) => new RegistrySessionData(value))
  annualRegistry?: RegistrySessionData;
}

export class DesirializedRoles extends PickType(User, [
  'login_id',
  'school_id',
  'activeYear',
  'tutorStudentIds',
  'annualConfigurator',
  'annualRegistry',
  'annualStudent',
  'annualTeacher',
]) {}
