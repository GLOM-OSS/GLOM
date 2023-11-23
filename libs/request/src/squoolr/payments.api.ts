import { EntryFeePaymentPayload, InitPaymentResponse } from '@glom/data-types';
import { GlomRequest } from '../lib/glom-request';

export class PaymentsApi {
  constructor(private readonly request: GlomRequest) {}

  async initEntryFeeApi(payload: EntryFeePaymentPayload) {
    const resp = await this.request.post<InitPaymentResponse>(
      `/payments/onboarding-fee`,
      payload
    );
    console.log(resp.data);
    return resp.data;
  }
}
