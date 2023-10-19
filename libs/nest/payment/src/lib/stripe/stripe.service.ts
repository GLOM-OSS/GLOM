import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Stripe } from 'stripe';
import type {
  CreatePaymentIntent,
  StripeConfigOptions,
  VerificationSession,
} from './stripe.type';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor({ apiSecretKey, ...configOptions }: StripeConfigOptions) {
    this.stripe = new Stripe(apiSecretKey, configOptions);
  }

  async createVerificationSession(metadata: Stripe.MetadataParam) {
    return await this.stripe.identity.verificationSessions.create({
      type: 'document',
      options: {
        document: {
          require_matching_selfie: true,
        },
      },
      metadata,
    });
  }

  async getVerificationSession(verification_id: string) {
    return await this.stripe.identity.verificationSessions.retrieve(
      verification_id
    );
  }

  async createPaymentIntent({
    payment_method_types = 'card',
    ...newIntent
  }: CreatePaymentIntent) {
    return await this.stripe.paymentIntents.create({
      ...newIntent,
      payment_method_types:
        payment_method_types === 'link'
          ? ['link', 'card']
          : [payment_method_types],
    });
  }

  async getCharges(payment_intent?: string) {
    const charges = await this.stripe.charges.list({ payment_intent });
    return charges.data;
  }

  async webhook(
    input: {
      payload: string | Buffer;
      signature: string | string[] | Buffer;
      webhook_secret: string;
    },
    callbacks?: {
      onSucess?: () => Promise<void> | void;
      onError?: (reason?: string) => Promise<void> | void;
    }
  ) {
    const { payload, webhook_secret, signature } = input;
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload.toString(),
        signature,
        webhook_secret
      );
    } catch (err) {
      Logger.warn(`⚠️  Webhook signature verification failed. ${err}`);
      throw new HttpException(
        `⚠️  Webhook signature verification failed.`,
        HttpStatus.BAD_REQUEST
      );
    }

    // Extract the data from the event.
    const data: Stripe.Event.Data = event.data;
    const eventType: string = event.type;
    Logger.log(`🔔  Webhook received: ${data.object} ${data['status']}!`);

    switch (eventType) {
      case 'payment_intent.succeeded': {
        if (callbacks?.onSucess) await callbacks.onSucess();
        // Funds have been captured
        Logger.log('💰 Payment captured!');
        break;
      }
      case 'payment_intent.payment_failed': {
        if (callbacks?.onError) await callbacks.onError();
        Logger.error('❌ Payment failed.');
        break;
      }
      case 'identity.verification_session.verified': {
        if (callbacks?.onSucess) await callbacks.onSucess();
        // All the verification checks passed
        Logger.log('💰 Identity verified successfully !!!');
        break;
      }
      case 'identity.verification_session.requires_input': {
        // At least one of the verification checks failed
        const vs: VerificationSession = event.data
          .object as VerificationSession;
        Logger.error(`❌ Verification check failed: ${vs.last_error.reason}`);

        // Handle specific failure reasons
        if (callbacks?.onError)
          await callbacks.onError(vs.last_error.code.split('_').join(' '));
      }
    }
  }
}
