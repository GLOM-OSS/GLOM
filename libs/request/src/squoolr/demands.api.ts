import {
  SchoolEntity,
  SchoolDemandDetails,
  SubmitSchoolDemandPayload,
  ValidateSchoolDemandPayload,
} from '@glom/data-types/squoolr';
import { GlomRequest } from '../lib/glom-request';

export class DemandsApi {
  constructor(private readonly request: GlomRequest) {}

  async submitDemand(schoolDemandPayload: SubmitSchoolDemandPayload) {
    const resp = await this.request.post<SchoolEntity>(
      '/demands/new',
      schoolDemandPayload
    );
    return resp.data;
  }

  async getDemands() {
    const resp = await this.request.get<SchoolEntity[]>('/demands');
    return resp.data;
  }

  async getDemand(schoolId: string) {
    const resp = await this.request.get<SchoolEntity>(
      `/demands/${schoolId}`
    );
    return resp.data;
  }

  async getDemandDetails(scoolId: string) {
    const resp = await this.request.get<SchoolDemandDetails>(
      `/demands/${scoolId}/details`
    );
    return resp.data;
  }

  async validateDemand(
    schoolId: string,
    validatedDemandPayload: ValidateSchoolDemandPayload
  ) {
    const resp = await this.request.put(
      `/demands/${schoolId}/validate`,
      validatedDemandPayload
    );
    return resp.data;
  }

  async processDemand(schoolId: string) {
    const resp = await this.request.patch(`/demands/${schoolId}/status`, {});
    return resp.data;
  }
}
