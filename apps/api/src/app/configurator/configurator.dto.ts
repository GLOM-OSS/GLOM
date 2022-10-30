import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
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
}

export class ClassroomPost {
  @IsNumber()
  @ApiProperty()
  level: number;

  @IsNumber()
  @ApiProperty()
  total_fees_due: number;

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

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => ClassroomPost)
  classrooms: ClassroomPost[];
}

export class AnnualMajorPutDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  major_name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  major_acronym?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  department_code?: string;

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
  total_fees_due: number;

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
  teacher_grade_id: string;

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
  has_tax_payer_card: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  tax_payer_card_number?: number;
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
