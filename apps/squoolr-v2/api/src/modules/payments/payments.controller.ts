import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { EntryFeePaymentDto, PaymentEntity } from './payment.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('onboarding-fee')
  @ApiCreatedResponse({ type: [PaymentEntity] })
  initEntryFeePayment(@Body() payload: EntryFeePaymentDto) {
    return this.paymentsService.initOnboardFeePayment(payload.payment_phone);
  }
}
