import { ApiProperty } from '@nestjs/swagger';
import { Payment, PaymentProvider, PaymentReasonEnum } from '@prisma/client';
import { IsPhoneNumber } from 'class-validator';

export class EntryFeePaymentDto {
  @ApiProperty()
  @IsPhoneNumber()
  payment_phone: string;

  constructor(props: PaymentEntity) {
    Object.entries(props).forEach(([key, value]) => {
      if (key in this) this[key] = value;
    });
  }
}

export class PaymentEntity implements Payment {
  @ApiProperty()
  payment_id: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  payment_ref: string;

  @ApiProperty({ enum: PaymentProvider })
  provider: PaymentProvider;

  @ApiProperty({ enum: PaymentReasonEnum })
  payment_reason: PaymentReasonEnum;

  constructor(props: PaymentEntity) {
    Object.entries(props).forEach(([key, value]) => {
      if (key in this) this[key] = value;
    });
  }
}

export class InitPaymentResponse {
  @ApiProperty({ type: PaymentEntity })
  payment: PaymentEntity;

  @ApiProperty()
  authorization_url: string;

  constructor(props: InitPaymentResponse) {
    Object.entries(props).forEach(([key, value]) => {
      if (key in this) this[key] = value;
    });
  }
}
