import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumberString, IsOptional, IsUUID } from 'class-validator';

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
  @IsUUID()
  @IsOptional()
  @ApiProperty({ required: false })
  major_id?: string;

  @IsOptional()
  @IsNumberString()
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
