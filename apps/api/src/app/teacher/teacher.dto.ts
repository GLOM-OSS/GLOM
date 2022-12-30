import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsUUID } from 'class-validator';

export class EvaluationParamDto {
  @IsUUID()
  @ApiProperty()
  annual_evaluation_sub_type_id: string;

  @IsUUID()
  @ApiProperty()
  annual_credit_unit_subject_id: string;
}

export class ExamDatePutDto {
  @ApiProperty()
  @IsDateString()
  examination_date: Date;
}
