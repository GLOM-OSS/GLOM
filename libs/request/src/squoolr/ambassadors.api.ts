import { AmbassadorEntity } from '@glom/data-types';
import { GlomRequest } from '../lib/glom-request';

export class AmbassadorsApi {
  constructor(private readonly request: GlomRequest) {}

  verifyReferralCode(referralCode: string) {
    return this.request.get<AmbassadorEntity>(
      `/ambassadors/${referralCode}/verify`
    );
  }

  getAmbassador(ambassadorId: string) {
    return this.request.get<AmbassadorEntity>(`/ambassadors/${ambassadorId}`);
  }
}
