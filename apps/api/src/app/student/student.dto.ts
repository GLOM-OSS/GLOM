import { ApiProperty } from '@nestjs/swagger';
import { PaymentReasonEnum } from '@prisma/client';
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class StudentQueryQto {
  @IsOptional()
  @ApiProperty({ required: false })
  major_code?: string;

  @IsOptional()
  @ApiProperty()
  classroom_code?: string;
}

export class CreatePaymentDto {
  @IsNumber()
  @ApiProperty()
  amount: number;

  @IsArray()
  @IsOptional()
  @ArrayMaxSize(14)
  @ApiProperty({ required: false })
  semesterNumbers?: number[];

  @ApiProperty()
  @IsEnum(PaymentReasonEnum)
  payment_reason: PaymentReasonEnum;

  @ApiProperty()
  @IsDateString()
  payment_date: Date;

  @IsString()
  @ApiProperty()
  transaction_id: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({ required: false })
  annual_student_id?: string;
}
