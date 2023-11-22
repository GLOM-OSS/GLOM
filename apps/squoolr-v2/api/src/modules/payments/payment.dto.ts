import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

export class EntryFeePaymentDto {
  @ApiProperty()
  @IsPhoneNumber()
  payment_phone: string;
}
