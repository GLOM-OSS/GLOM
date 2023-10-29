import { GlomRequest } from '../lib/glom-request';

export class AmbassadorsApi {
  constructor(private readonly request: GlomRequest) {}

  verifyReferralCode(referralCode: string) {
    return this.request.get(`/ambassadors/${referralCode}/verify`);
  }

  getAmbassador(ambassadorId: string) {
    return this.request.get(`/ambassadors/${ambassadorId}`);
  }
}
