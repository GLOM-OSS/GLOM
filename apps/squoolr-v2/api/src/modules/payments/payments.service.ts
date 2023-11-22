import { NotchPayService } from '@glom/payment';
import { GlomPrismaService } from '@glom/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  constructor(
    private prismaService: GlomPrismaService,
    private notchPayService: NotchPayService
  ) {}

  async initOnboardFeePayment(phone: string) {
    const settings =
      await this.prismaService.platformSettings.findFirstOrThrow();
    const newPayment = await this.notchPayService.initiatePayment({
      amount: settings.onboarding_fee,
      phone,
    });
    return newPayment;
  }
}
