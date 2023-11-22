import { SchemaCreateResponseBody, SchemaRequestBody } from '../../api-helper';
import { SchemaResponseBody } from '../api-helper';
import { operations } from '../docs';

export type EntryFeePaymentPayload = SchemaRequestBody<
  operations,
  'PaymentsController_initEntryFeePayment'
>;

export type PaymentEntity = SchemaCreateResponseBody<
  operations,
  'PaymentsController_initEntryFeePayment'
>[0];
