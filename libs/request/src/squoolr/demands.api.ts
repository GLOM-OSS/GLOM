import {
  SchoolEntity,
  SchoolDemandDetails,
  SubmitSchoolDemandPayload,
  ValidateSchoolDemandPayload,
  DemandStatus,
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

  async getDemands(schoolDemandStaus?: DemandStatus[]) {
    const resp = await this.request.get<SchoolEntity[]>('/demands', {
      schoolDemandStaus:
        schoolDemandStaus?.length > 0 ? schoolDemandStaus : undefined,
    });
    return resp.data;
  }

  async getDemand(schoolId: string) {
    const resp = await this.request.get<SchoolEntity>(`/demands/${schoolId}`);
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

  async updateDemandStatus(
    schoolId: string,
    status: Extract<DemandStatus, 'PROCESSING' | 'SUSPENDED'>
  ) {
    const resp = await this.request.patch(`/demands/${schoolId}/status`, {
      school_status: status,
    });
    return resp.data;
  }
}
