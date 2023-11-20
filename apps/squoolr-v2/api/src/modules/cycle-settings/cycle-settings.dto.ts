import { ApiProperty } from '@nestjs/swagger';
import {
  AnnualEvaluationType,
  AnnualSemesterExamAcess,
  EvaluationTypeEnum,
} from '@prisma/client';
import { Exclude, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsIn,
  IsPositive,
  IsString,
  Max,
  ValidateNested,
} from 'class-validator';

export class QueryCycleSettingsDto {
  @IsString()
  @ApiProperty()
  cycle_id: string;

  constructor(props: QueryCycleSettingsDto) {
    Object.assign(this, props);
  }
}

export class ExamAcessSettingPayload {
  @IsIn([1, 2])
  @ApiProperty()
  annual_semester_number: number;

  @Max(100)
  @IsPositive()
  @ApiProperty()
  payment_percentage: number;

  constructor(props: ExamAcessSettingPayload) {
    Object.assign(this, props);
  }
}

export class UpdateExamAcessSettingDto extends QueryCycleSettingsDto {
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => ExamAcessSettingPayload)
  @ApiProperty({ type: [ExamAcessSettingPayload, ExamAcessSettingPayload] })
  payload: [ExamAcessSettingPayload, ExamAcessSettingPayload];
}

export class ExamAccessSettingEntitty
  extends ExamAcessSettingPayload
  implements AnnualSemesterExamAcess
{
  @ApiProperty()
  annual_semester_exam_access_id: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  cycle_id: string;

  @ApiProperty()
  academic_year_id: string;

  @Exclude()
  @ApiProperty()
  created_by: string;

  constructor(props: ExamAccessSettingEntitty) {
    super(props);
    Object.assign(this, props);
  }
}

export class EvaluationTypePayload {
  @ApiProperty()
  evaluation_type_weight: number;

  @ApiProperty({ enum: EvaluationTypeEnum })
  evaluation_type: EvaluationTypeEnum;

  constructor(props: EvaluationTypePayload) {
    Object.assign(this, props);
  }
}

export class UpdateEvaluaTypeWeightingsDto {
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => EvaluationTypePayload)
  @ApiProperty({
    type: [EvaluationTypePayload, EvaluationTypePayload],
  })
  payload: [EvaluationTypePayload, EvaluationTypePayload];
}

export class EvaluationTypeEntity
  extends EvaluationTypePayload
  implements AnnualEvaluationType
{
  @ApiProperty()
  annual_evaluation_type_id: string;

  @ApiProperty()
  cycle_id: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  academic_year_id: string;

  @Exclude()
  @ApiProperty()
  created_by: string;

  constructor(props: EvaluationTypeEntity) {
    super(props);
    Object.assign(this, props);
  }
}
