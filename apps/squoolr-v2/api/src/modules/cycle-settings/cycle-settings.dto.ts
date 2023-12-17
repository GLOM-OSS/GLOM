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
  IsBoolean,
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
  @IsNumber()
  @ApiProperty()
  evaluation_type_weight: number;

  @IsEnum(EvaluationTypeEnum)
  @ApiProperty({ enum: EvaluationTypeEnum })
  evaluation_type: EvaluationTypeEnum;

  constructor(props: EvaluationTypePayload) {
    Object.assign(this, props);
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
    Object.assign(this, props);
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
    Object.assign(this, props);
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
    Object.assign(this, props);
  }
}

export class UpdateWeightingSystemDto extends QueryCycleSettingsDto {
  @IsNumber()
  @ApiProperty()
  weighting_system: number;

  constructor(props: UpdateWeightingSystemDto) {
    super(props);
    Object.assign(this, props);
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
    Object.assign(this, props);
  }
}

export class UpdateMajorSettingsDto {
  @IsBoolean()
  @ApiProperty()
  uses_module_system: boolean;

  @IsString({ each: true })
  @ApiProperty({ type: [String] })
  annualMajorIds: string[];
}