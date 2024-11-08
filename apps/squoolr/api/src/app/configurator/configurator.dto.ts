import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { PersonPostDto } from '../app.dto';

export class DepartmentPostDto {
  @IsString()
  @ApiProperty()
  department_name: string;

  @IsString()
  @ApiProperty()
  department_acronym: string;
}
export class DepartmentPutDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  department_name?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  is_deleted?: boolean;
}

export class DepartmentQueryDto {
  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  is_deleted?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  keywords?: string;
}

export class ClassroomPost {
  @IsNumber()
  @ApiProperty()
  level: number;

  @IsNumber()
  @ApiProperty()
  total_fee_due: number;

  @IsNumber()
  @ApiProperty()
  registration_fee: number;
}
export class MajorPostDto {
  @IsString()
  @ApiProperty()
  major_name: string;

  @IsString()
  @ApiProperty()
  major_acronym: string;

  @IsString()
  @ApiProperty()
  department_code: string;

  @IsUUID()
  @ApiProperty()
  cycle_id: string;

  @IsArray()
  @Type(() => ClassroomPost)
  @ValidateNested({ each: true })
  @ApiProperty({ type: ClassroomPost, isArray: true })
  classrooms: ClassroomPost[];
}

export class MajorPutDto extends OmitType(PartialType(MajorPostDto), [
  'cycle_id',
]) {
  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  is_deleted?: boolean;
}

export class MajorQueryDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  department_code?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  is_deleted?: boolean;
}

export class ClassroomPutDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  registration_fee: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  total_fee_due: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  is_deleted?: boolean;
}

export class ClassroomDivisionQueryDto {
  @IsString()
  @ApiProperty()
  annual_classroom_id: string;
}

export class ClassroomQueryDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({ required: false })
  academic_year_id?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  department_code?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  major_code?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  level?: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  is_deleted?: boolean;
}

export class StaffPostData extends OmitType(PersonPostDto, ['password']) {}

export class TeacherPostDto extends StaffPostData {
  @IsUUID()
  @ApiProperty()
  teaching_grade_id: string;

  @IsUUID()
  @ApiProperty()
  teacher_type_id: string;

  @IsString()
  @ApiProperty()
  origin_institute: string;

  @IsNumber()
  @ApiProperty()
  hourly_rate: number;

  @IsBoolean()
  @ApiProperty()
  has_signed_convention: boolean;

  @IsBoolean()
  @ApiProperty()
  has_tax_payers_card: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  tax_payer_card_number?: string;
}

export class CoordinatorPostDto {
  @IsString()
  @ApiProperty()
  annual_teacher_id: string;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  classroom_division_ids: string[];
}

export class StaffPutDto extends PartialType(StaffPostData) {}
export class TeacherPutDto extends PartialType(TeacherPostDto) {}

export class PersonnelQueryDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  keywords?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  is_deleted?: boolean;
}

export class PersonnelTemplate {
  @IsBoolean()
  @ApiProperty()
  reuse_configurators?: boolean;

  @IsBoolean()
  @ApiProperty()
  reuse_registries?: boolean;

  @IsBoolean()
  @ApiProperty()
  reuse_coordinators?: boolean;

  @IsBoolean()
  @ApiProperty()
  reuse_teachers?: boolean;
}

export class AcademicYearPostDto {
  @ApiProperty()
  @IsDateString()
  starts_at: Date;

  @ApiProperty()
  @IsDateString()
  ends_at: Date;
}

export class TemplateYearPostDto extends AcademicYearPostDto {
  @Type(() => PersonnelTemplate)
  @ValidateNested({ each: true })
  @ApiProperty({ type: PersonnelTemplate })
  personnelConfig: PersonnelTemplate;

  @IsArray()
  @ApiProperty()
  classroomCodes: string[];

  @IsBoolean()
  @ApiProperty()
  reuse_coordinators_configs?: boolean;

  @IsBoolean()
  @ApiProperty()
  reuse_registries_configs?: boolean;
}
