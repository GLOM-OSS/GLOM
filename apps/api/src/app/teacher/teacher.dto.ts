import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class EvaluationParamDto {
  @IsUUID()
  @ApiProperty()
  annual_evaluation_sub_type_id: string;

  @IsUUID()
  @ApiProperty()
  annual_credit_unit_subject_id: string;
}
