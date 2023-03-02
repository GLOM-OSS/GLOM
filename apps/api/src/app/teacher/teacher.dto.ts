import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { QuestionType, SubmissionType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
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

  @IsString()
  @ApiProperty()
  private_code: string;
}

export class AssessmentPostDto {
  @IsOptional()
  @IsEnum(SubmissionType)
  @ApiProperty({ required: false })
  submission_type?: SubmissionType;

  @IsBoolean()
  @ApiProperty()
  is_assignment: boolean;

  @Min(2)
  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  number_per_group?: number;

  @IsUUID()
  @ApiProperty()
  annual_credit_unit_subject_id: string;
}

export class AssessmentPutDto extends PartialType(
  OmitType(AssessmentPostDto, ['annual_credit_unit_subject_id'])
) {
  @ApiProperty()
  @IsDateString()
  assessment_date: Date;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  duration?: number;
}

export class PublishAssessmentDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty()
  annual_evaluation_sub_type_id?: string;
}

export class CreateQuestionOption {
  @IsBoolean()
  @ApiProperty()
  is_answer: boolean;

  @IsString()
  @ApiProperty()
  option: string;
}

export class QuestionOption extends CreateQuestionOption {
  @IsUUID()
  @ApiProperty()
  question_option_id: string;
}

export class QuestionPostDto {
  @IsString()
  @ApiProperty()
  question: string;

  @ApiProperty()
  @IsNumberString()
  question_mark: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  question_answer?: string;

  @IsOptional()
  @IsEnum(QuestionType)
  @ApiProperty({ required: false })
  question_type?: QuestionType;

  @IsUUID()
  @ApiProperty({ required: false })
  assessment_id: string;

  @IsArray()
  @IsOptional()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @ApiProperty({ required: false })
  @Type(() => CreateQuestionOption)
  questionOptions?: CreateQuestionOption[];
}

export class QuestionPutDto extends PartialType(
  OmitType(QuestionPostDto, ['assessment_id', 'questionOptions'])
) {
  @IsArray()
  @ApiProperty()
  @IsString({ each: true })
  deletedOptionIds: string[];

  @IsArray()
  @ApiProperty()
  @IsString({ each: true })
  deletedResourceIds: string[];

  @IsArray()
  @ApiProperty()
  @Type(() => QuestionOption)
  @ValidateNested({ each: true })
  editedOptions: QuestionOption[];

  @IsArray()
  @ApiProperty()
  @Type(() => CreateQuestionOption)
  @ValidateNested({ each: true })
  newOptions: CreateQuestionOption[];
}

export class PresenceListPostDto {
  @ApiProperty()
  @IsDateString()
  end_time: Date;

  @ApiProperty()
  @IsDateString()
  start_time: Date;

  @ApiProperty()
  @IsDateString()
  presence_list_date: Date;

  @IsUUID()
  @ApiProperty()
  annual_credit_unit_subject_id: string;

  @ApiProperty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  studentIds: string[];

  @IsArray()
  @ApiProperty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  chapterIds: string[];
}

export class Student {
  @IsUUID()
  @ApiProperty()
  annual_student_id: string;

  @IsBoolean()
  @ApiProperty()
  is_present: boolean;

  @IsString()
  @ApiProperty()
  matricule: string;

  @IsString()
  @ApiProperty()
  fullname: string;
}

export class PresenceListChapter {
  @IsUUID()
  @ApiProperty()
  chpater_id: string;

  @IsString()
  @ApiProperty()
  chapter_title: string;
}

export class PresenceListPutDto extends PartialType(
  OmitType(PresenceListPostDto, [
    'studentIds',
    'chapterIds',
    'annual_credit_unit_subject_id',
  ])
) {
  @IsArray()
  @ApiProperty()
  @IsString({ each: true })
  addedChapterIds: string[];

  @IsArray()
  @ApiProperty()
  @IsString({ each: true })
  removedChapterIds: string[];

  @IsArray()
  @ApiProperty()
  @IsString({ each: true })
  addedStudentIds: string[];

  @IsArray()
  @ApiProperty()
  @IsString({ each: true })
  removedStudentIds: string[];
}
