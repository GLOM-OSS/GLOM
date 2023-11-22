import { NotchPayService } from '@glom/payment';
import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import { InitPaymentResponse, PaymentEntity } from './payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private prismaService: GlomPrismaService,
    private notchPayService: NotchPayService
  ) {}

  async initOnboardFeePayment(phoneNumber: string) {
    const settings =
      await this.prismaService.platformSettings.findFirstOrThrow();
    const {
      authorization_url,
      transaction: { reference },
    } = await this.notchPayService.initiatePayment({
      amount: settings.onboarding_fee,
      phone: phoneNumber,
    });
    const payment = await this.prismaService.payment.create({
      data: {
        provider: 'NotchPay',
        payment_ref: reference,
        payment_reason: 'Onboarding',
        amount: settings.platform_fee,
      },
    });
    return new InitPaymentResponse({
      authorization_url,
      payment: new PaymentEntity(payment),
    });
  }
}
