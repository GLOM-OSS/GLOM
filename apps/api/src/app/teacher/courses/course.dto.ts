import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class ChapterPostDto {
  @IsString()
  @ApiProperty()
  chapter_title: string;

  @IsString()
  @ApiProperty()
  chapter_objective: string;

  @Min(1)
  @IsNumber()
  @ApiProperty()
  chapter_position: number;

  @IsUUID()
  @IsOptional()
  @ApiProperty({ required: false })
  chapter_parent_id?: string;

  @IsUUID()
  @ApiProperty()
  annual_credit_unit_subject_id: string;
}

export class ChapterPutDto extends PartialType(ChapterPostDto) {}

export class ResourceOwner {
  @IsUUID()
  @IsOptional()
  @ApiProperty({ required: false })
  chapter_id?: string;

  @IsUUID()
  @ApiProperty()
  annual_credit_unit_subject_id: string;
}

export class LinkPostDto extends ResourceOwner {
  @IsString()
  @ApiProperty({ required: false })
  resource_ref: string;

  @IsString()
  @ApiProperty({ required: false })
  resource_name: string;
}

export class QuestionAnswer {
  @IsString()
  @IsOptional()
  @ApiProperty()
  response?: string;

  @IsUUID()
  @ApiProperty()
  question_id: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty()
  answered_option_id?: string;
}
export class StudentAnswerDto {
  @IsArray()
  @ApiProperty()
  @Type(() => QuestionAnswer)
  @ValidateNested({ each: true })
  answers: QuestionAnswer[];
}

export class CorrectedQuestion {
  @IsUUID()
  @ApiProperty()
  question_id: string;

  @IsNumber()
  @ApiProperty()
  question_mark: number;

  @IsString()
  @ApiProperty()
  teacher_comment: string;
}

export class GivenScore {
  @IsUUID()
  @ApiProperty()
  annual_student_id: string;

  @IsNumber()
  @ApiProperty()
  total_score: number;
}

export class CorrectAnswerDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  group_code?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty()
  annual_student_id?: string;

  @IsArray()
  @ApiProperty()
  @Type(() => CorrectedQuestion)
  @ValidateNested({ each: true })
  correctedAnswers: CorrectedQuestion[];

  @IsArray()
  @IsOptional()
  @Type(() => GivenScore)
  @ValidateNested({ each: true })
  @ApiProperty({ required: false })
  givenScores?: GivenScore[];
}
