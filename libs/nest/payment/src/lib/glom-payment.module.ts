import { Module, Provider } from '@nestjs/common';
import axios from 'axios';

import { PaymentModuleOptions } from './glom-payment';
import { NotchPayService } from './notchpay/notchpay.service';
import { StripeService } from './stripe/stripe.service';

@Module({})
export class GlomPaymentModule {
  static forRoot({ isGlobal = false, aggrConfigs }: PaymentModuleOptions) {
    const providers: Provider[] = aggrConfigs.map(({ aggr, options }) => {
      switch (aggr) {
        case 'stripe':
          return {
            provide: StripeService,
            useValue: new StripeService(options),
          };
        case 'notchpay':
          return {
            provide: NotchPayService,
            useValue: new NotchPayService(options),
          };
      }
    });
    return {
      global: isGlobal,
      module: GlomPaymentModule,
      exports: providers,
      providers,
    };
  }
}
