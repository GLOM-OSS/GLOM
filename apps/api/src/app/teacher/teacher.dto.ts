import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber, IsOptional, IsString, IsUUID,
  ValidateNested
} from 'class-validator';

export class EvaluationQueryDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({ required: false })
  evaluation_id?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({ required: false })
  annual_evaluation_sub_type_id?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({ required: false })
  annual_credit_unit_subject_id?: string;
}

export class EvaluationsQeuryDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  major_code?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  semester_number?: number;

  @IsUUID()
  @IsOptional()
  @ApiProperty({ required: false })
  annual_credit_unit_id?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({ required: false })
  annual_credit_unit_subject_id?: string;
}

export class ExamDatePutDto {
  @ApiProperty()
  @IsDateString()
  examination_date: Date;
}

export class StudentMark {
  @IsUUID()
  @ApiProperty()
  evaluation_has_student_id: string;

  @IsNumber()
  @ApiProperty()
  mark: number;
}

export class EvaluationMarkDto {
  @IsArray()
  @ApiProperty()
  @ArrayMinSize(1)
  @Type(() => StudentMark)
  @ValidateNested({ each: true })
  studentMarks: StudentMark[];

  @IsBoolean()
  @ApiProperty()
  is_published: boolean;
}