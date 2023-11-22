import { EntryFeePaymentPayload, PaymentEntity } from '@glom/data-types';
import { GlomRequest } from '../lib/glom-request';

export class PaymentsApi {
  constructor(private readonly request: GlomRequest) {}

  async initEntryFeeApi(payload: EntryFeePaymentPayload) {
    const resp = await this.request.post<PaymentEntity>(`/payments`, payload);
    return resp.data;
  }
}
