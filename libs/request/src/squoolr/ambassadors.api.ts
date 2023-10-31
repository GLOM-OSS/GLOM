import { AmbassadorEntity } from '@glom/data-types';
import { GlomRequest } from '../lib/glom-request';

export class AmbassadorsApi {
  constructor(private readonly request: GlomRequest) {}

  async verifyReferralCode(referralCode: string) {
    const resp = await this.request.get<AmbassadorEntity>(
      `/ambassadors/${referralCode}/verify`
    );
    return !!resp.data;
  }

  async getAmbassador(ambassadorId: string) {
    const resp = await this.request.get<AmbassadorEntity>(
      `/ambassadors/${ambassadorId}`
    );
    return resp.data;
  }
}
