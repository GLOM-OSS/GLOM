import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import {
  EntryFeePaymentDto,
  InitPaymentResponse
} from './payment.dto';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('onboarding-fee')
  @ApiCreatedResponse({ type: InitPaymentResponse })
  initEntryFeePayment(@Body() payload: EntryFeePaymentDto) {
    return this.paymentsService.initOnboardFeePayment(payload);
  }
}
