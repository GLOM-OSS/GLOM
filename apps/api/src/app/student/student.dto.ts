import { ApiProperty } from '@nestjs/swagger';
import { PaymentReasonEnum } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class StudentQueryQto {
  @IsOptional()
  @ApiProperty()
  major_code?: string;

  @IsOptional()
  @ApiProperty()
  classroom_code?: string;
}

export class CreatePaymentDto {
  @IsNumber()
  amount: number;

  @Min(1)
  @Max(14)
  @IsNumber()
  semester_number: number;

  @IsEnum(PaymentReasonEnum)
  payment_reason: PaymentReasonEnum;

  @IsDateString()
  payment_date: Date;

  @IsUUID()
  @IsOptional()
  annual_student_id: string;
}
