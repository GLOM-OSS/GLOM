import Stripe from 'stripe';

export type IStripeConfigOptions = Stripe.StripeConfig & {
  /**
   * stripe api secret key
   * @example sk_aqswde55Fd5454r5dd45dyuui156s65Sk51ko
   */
  apiSecretKey: string;
};

export type CreatePaymentIntent = {
  amount: number;
  currency: string;
  description?: string;
  receipt_email: string;
  payment_method_types?: 'link' | 'card';
};

export type VerificationSession = Stripe.Identity.VerificationSession;
