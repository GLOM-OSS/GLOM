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
import { Exclude, Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ActiveYear, SessionData } from './auth';
import { AcademicYearEntity } from '../../modules/academic-years/academic-years.dto';
import { Logger } from '@nestjs/common';

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
    Object.assign(this, props);
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
export class User extends PersonEntity implements SessionData {
  @ApiProperty()
  login_id: string;

  @ApiPropertyOptional()
  school_id?: string;

  @ApiPropertyOptional({ type: [String] })
  tutorStudentIds?: string[];

  @ApiProperty()
  @Type(() => ActiveYearSessionData)
  @Transform(({ value }) => new ActiveYearSessionData(value))
  activeYear?: ActiveYearSessionData;

  @Type(() => StudentSessionData)
  @ApiPropertyOptional({ type: StudentSessionData })
  @Transform(({ value }) => new StudentSessionData(value))
  annualStudent?: StudentSessionData;

  @ApiPropertyOptional({ type: ConfiguratorSessionData })
  @Transform(({ value }) => new ConfiguratorSessionData(value))
  @Type(() => ConfiguratorSessionData)
  annualConfigurator?: ConfiguratorSessionData;

  @ApiPropertyOptional({ type: TeacherSessionData })
  @Transform(({ value }) => new TeacherSessionData(value))
  @Type(() => TeacherSessionData)
  annualTeacher?: TeacherSessionData;

  @ApiPropertyOptional({ type: TeacherSessionData })
  @Transform(({ value }) => new RegistrySessionData(value))
  @Type(() => RegistrySessionData)
  annualRegistry?: RegistrySessionData;

  constructor(props: User) {
    super(props);
    Object.assign(this, props);
  }
}

export class SessionEntity extends PickType(User, [
  'login_id',
  'school_id',
  'activeYear',
  'tutorStudentIds',
  'annualConfigurator',
  'annualRegistry',
  'annualStudent',
  'annualTeacher',
]) {}

export class SingInResponse {
  @ApiProperty({ type: User })
  @Transform(({ value }) => new User(value))
  user: User;

  @ApiPropertyOptional({ type: [AcademicYearEntity] })
  @Transform(({ value: values }) =>
    values.map((value) => new AcademicYearEntity(value))
  )
  academicYears?: AcademicYearEntity[];

  constructor(props: SingInResponse) {
    Object.assign(this, props);
  }
}
