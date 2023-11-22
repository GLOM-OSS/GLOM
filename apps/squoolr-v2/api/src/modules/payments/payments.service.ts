import { NotchPayService } from '@glom/payment';
import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';
import { PaymentEntity } from './payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private prismaService: GlomPrismaService,
    private notchPayService: NotchPayService
  ) {}

  async initOnboardFeePayment(phoneNumber: string) {
    const settings =
      await this.prismaService.platformSettings.findFirstOrThrow();
    const newPayment = await this.notchPayService.initiatePayment({
      amount: settings.onboarding_fee,
      phone: phoneNumber,
    });
    const payment = await this.prismaService.payment.create({
      data: {
        provider: 'NotchPay',
        payment_reason: 'Onboarding',
        amount: settings.platform_fee,
        payment_ref: newPayment.reference,
      },
    });
    return new PaymentEntity(payment);
  }
}
