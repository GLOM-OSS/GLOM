import { NotchPayConfigOptions } from './notchpay/notchpay.type';
import { StripeConfigOptions } from './stripe/stripe.type';

export type AggrConfigOptions =
  | {
      aggr: 'stripe';
      options: StripeConfigOptions;
    }
  | {
      aggr: 'notchpay';
      options: NotchPayConfigOptions;
    };

export type PaymentModuleOptions = {
  isGlobal?: boolean;
  aggrConfigs: AggrConfigOptions[];
};
