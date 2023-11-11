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

  async getDemand(school_code: string) {
    const resp = await this.request.get<SchoolEntity>(
      `/demands/${school_code}`
    );
    return resp.data;
  }

  async getDemandDetails(school_code: string) {
    const resp = await this.request.get<SchoolDemandDetails>(
      `/demands/${school_code}/details`
    );
    return resp.data;
  }

  async validateDemand(
    school_code: string,
    validatedDemandPayload: ValidateSchoolDemandPayload
  ) {
    const resp = await this.request.put(
      `/demands/${school_code}/validate`,
      validatedDemandPayload
    );
    return resp.data;
  }

  async processDemand(school_code: string) {
    const resp = await this.request.patch(`/demands/${school_code}/status`, {});
    return resp.data;
  }
}
