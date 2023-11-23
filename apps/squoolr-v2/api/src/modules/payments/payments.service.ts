import { NotchPayService } from '@glom/payment';
import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import {
  EntryFeePaymentDto,
  InitPaymentResponse,
  PaymentEntity,
} from './payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private prismaService: GlomPrismaService,
    private notchPayService: NotchPayService
  ) {}

  async initOnboardFeePayment({
    callback_url,
    payment_phone,
  }: EntryFeePaymentDto) {
    const settings =
      await this.prismaService.platformSettings.findFirstOrThrow();
    const {
      authorization_url,
      transaction: { reference },
    } = await this.notchPayService.initiatePayment({
      phone: payment_phone,
      callback: callback_url,
      amount: settings.onboarding_fee,
    });
    const payment = await this.prismaService.payment.create({
      data: {
        provider: 'NotchPay',
        payment_ref: reference,
        payment_reason: 'Onboarding',
        amount: settings.onboarding_fee,
      },
    });
    return new InitPaymentResponse({
      authorization_url,
      payment: new PaymentEntity(payment),
    });
  }
}
