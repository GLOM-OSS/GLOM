import { IStripeConfigOptions } from './stripe/stripe.type';

export type AggrConfigOptions = {
  aggr: 'stripe';
  options: IStripeConfigOptions;
};
