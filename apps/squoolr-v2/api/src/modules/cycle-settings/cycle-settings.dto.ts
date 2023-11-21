import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  AnnualEvaluationType,
  AnnualModuleSetting,
  AnnualSemesterExamAcess,
  AnnualWeighting,
  CarryOverSystemEnum,
  EvaluationTypeEnum,
} from '@prisma/client';
import { Exclude, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsEnum,
  IsIn,
  IsNumber,
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
    Object.entries(props).forEach(([key, value]) => {
      if (key in this) this[key] = value;
    });
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
    Object.entries(props).forEach(([key, value]) => {
      if (key in this) this[key] = value;
    });
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
    Object.entries(props).forEach(([key, value]) => {
      if (key in this) this[key] = value;
    });
  }
}

export class EvaluationTypePayload {
  @IsNumber()
  @ApiProperty()
  evaluation_type_weight: number;

  @IsEnum(EvaluationTypeEnum)
  @ApiProperty({ enum: EvaluationTypeEnum })
  evaluation_type: EvaluationTypeEnum;

  constructor(props: EvaluationTypePayload) {
    Object.entries(props).forEach(([key, value]) => {
      if (key in this) this[key] = value;
    });
  }
}

export class UpdateEvaluaTypeDto extends QueryCycleSettingsDto {
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
  @ApiHideProperty()
  created_by: string;

  constructor(props: EvaluationTypeEntity) {
    super(props);
    Object.entries(props).forEach(([key, value]) => {
      if (key in this) this[key] = value;
    });
  }
}

export class UpdateModuleSettingDto extends QueryCycleSettingsDto {
  @IsEnum(CarryOverSystemEnum)
  @ApiProperty({ enum: CarryOverSystemEnum })
  carry_over_system: CarryOverSystemEnum;

  @IsNumber()
  @ApiPropertyOptional()
  minimum_modulation_score: number;

  constructor(props: UpdateModuleSettingDto) {
    super(props);
    Object.entries(props).forEach(([key, value]) => {
      if (key in this) this[key] = value;
    });
  }
}

export class ModuleSettingEntity
  extends UpdateModuleSettingDto
  implements AnnualModuleSetting
{
  @ApiProperty()
  annual_module_setting_id: string;

  @ApiProperty()
  cycle_id: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  academic_year_id: string;

  @Exclude()
  @ApiHideProperty()
  created_by: string;

  constructor(props: ModuleSettingEntity) {
    super(props);
    Object.entries(props).forEach(([key, value]) => {
      if (key in this) this[key] = value;
    });
  }
}

export class UpdateWeightingSystemDto extends QueryCycleSettingsDto {
  @IsNumber()
  @ApiProperty()
  weighting_system: number;

  constructor(props: UpdateWeightingSystemDto) {
    super(props);
    Object.entries(props).forEach(([key, value]) => {
      if (key in this) this[key] = value;
    });
  }
}

export class QueryWeightingSettingsDto extends UpdateWeightingSystemDto {}

export class WeightingSystemEntity
  extends UpdateWeightingSystemDto
  implements AnnualWeighting
{
  @ApiProperty()
  annual_weighting_id: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  academic_year_id: string;

  @Exclude()
  @ApiHideProperty()
  created_by: string;

  constructor(props: WeightingSystemEntity) {
    super(props);
    Object.entries(props).forEach(([key, value]) => {
      if (key in this) this[key] = value;
    });
  }
}
