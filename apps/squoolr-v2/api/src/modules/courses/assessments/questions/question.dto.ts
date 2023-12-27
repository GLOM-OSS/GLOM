import {
  ArrayMinSize,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
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
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';

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

export class CreateOptionDto {
  @IsString()
  @ApiProperty()
  option: string;

  @IsBoolean()
  @ApiProperty()
  is_answer: boolean;

  constructor(props: CreateOptionDto) {
    Object.assign(this, props);
  }
}
export class QuestionOptionDto
  extends CreateOptionDto
  implements QuestionOption
{
  @ApiProperty()
  question_option_id: string;

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
    super(props);
    Object.assign(this, props);
  }
}

export class CreateQuestionDto {
  @IsString()
  @ApiProperty()
  assessment_id: string;

  @ApiProperty({ enum: QuestionType })
  question_type: QuestionType;

  @IsString()
  @ApiProperty()
  question: string;

  @IsNumber()
  @ApiProperty()
  question_mark: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example:
      'https://squoolr-question-resource-1.pdf,https://squoolr-question-resource-2.pdf',
    description: `For File type question, this a string containing the answer files links seperated by commats`,
  })
  question_answer: string | null;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  @ApiPropertyOptional({ type: [CreateOptionDto] })
  options: CreateOptionDto[];

  constructor(props: CreateQuestionDto) {
    Object.assign(this, props);
  }
}

export class QuestionEntity extends CreateQuestionDto implements Question {
  @ApiProperty()
  question_id: string;

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
    super(props);
    Object.assign(this, props);
  }
}

export class UpdateOptionDto extends PartialType(CreateOptionDto) {
  @IsString()
  @ApiProperty()
  question_option_id: string;
}
export class UpdateOptionsDto {
  @IsOptional()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  @ApiPropertyOptional({ type: [CreateOptionDto] })
  added?: CreateOptionDto[];

  @IsOptional()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateOptionDto)
  @ApiPropertyOptional({ type: [UpdateOptionDto] })
  updated?: UpdateOptionDto[];

  @IsOptional()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @ApiPropertyOptional({ type: [String] })
  deleted?: string[];
}

export class UpdateQuestionDto extends OmitType(
  PartialType(CreateQuestionDto),
  ['assessment_id', 'question_type', 'options']
) {
  @IsOptional()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @ApiPropertyOptional({ type: [String] })
  deletedResourceIds?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateOptionsDto)
  @ApiPropertyOptional({ type: UpdateOptionsDto })
  options?: UpdateOptionsDto;
}
