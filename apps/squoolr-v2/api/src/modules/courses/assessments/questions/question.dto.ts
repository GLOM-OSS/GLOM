import { IsEnum, IsOptional, IsString } from 'class-validator';
import { QueryParamsDto } from '../../../modules.dto';
import {
  Question,
  QuestionOption,
  QuestionResource,
  QuestionType,
} from '@prisma/client';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class QueryQuestionsDto extends QueryParamsDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  assessment_id?: string;

  @IsOptional()
  @IsEnum(QuestionType)
  @ApiPropertyOptional({ enum: QuestionType })
  question_type?: QuestionType;
}

export class QuestionResourceDto implements QuestionResource {
  @ApiProperty()
  question_resource_id: string;

  @ApiProperty()
  caption: number;

  @ApiProperty()
  resource_ref: string;

  @ApiProperty()
  question_id: string;

  @ApiProperty()
  created_at: Date;

  @Exclude()
  @ApiHideProperty()
  created_by: string;

  @Exclude()
  @ApiHideProperty()
  deleted_at: Date;

  @Exclude()
  @ApiHideProperty()
  deleted_by: string;

  constructor(props: QuestionResourceDto) {
    Object.assign(this, props);
  }
}

export class QuestionOptionDto implements QuestionOption {
  @ApiProperty()
  question_option_id: string;

  @ApiProperty()
  option: string;

  @ApiProperty()
  is_answer: boolean;

  @ApiProperty()
  question_id: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  is_deleted: boolean;

  @Exclude()
  @ApiHideProperty()
  created_by: string;

  constructor(props: QuestionOptionDto) {
    Object.assign(this, props);
  }
}

export class QuestionEntity implements Question {
  @ApiProperty()
  question_id: string;

  @ApiProperty()
  assessment_id: string;

  @ApiProperty({ enum: QuestionType })
  question_type: QuestionType;

  @ApiProperty()
  question: string;

  @ApiProperty()
  question_mark: number;

  @ApiProperty({ nullable: true })
  question_answer: string;

  @ApiProperty()
  is_deleted: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty({ type: [QuestionOptionDto] })
  options: QuestionOptionDto[];

  @ApiProperty({ type: [QuestionResourceDto] })
  resources: QuestionResourceDto[];

  @Exclude()
  @ApiHideProperty()
  created_by: string;

  constructor(props: QuestionEntity) {
    Object.assign(this, props);
  }
}
