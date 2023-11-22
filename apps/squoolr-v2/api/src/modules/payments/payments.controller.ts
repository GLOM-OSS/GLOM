import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiTags } from '@nestjs/swagger';
import { EntryFeePaymentDto } from './payment.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('onboarding-fee')
  initEntryFeePayment(@Body() payload: EntryFeePaymentDto) {
    return this.paymentsService.initOnboardFeePayment(payload.payment_phone);
  }
}
