import {
  SchoolEntity,
  SchoolDemandDetails,
  SubmitSchoolDemandPayload,
  ValidateSchoolDemandPayload,
  SchoolDemandStatus,
  SchoolQueryParams,
} from '@glom/data-types/squoolr';
import { GlomRequest } from '../lib/glom-request';

export class SchoolsApi {
  constructor(private readonly request: GlomRequest) {}

  async submitSchoolDemand(schoolDemandPayload: SubmitSchoolDemandPayload) {
    const resp = await this.request.post<SchoolEntity>(
      '/schools/new',
      schoolDemandPayload
    );
    return resp.data;
  }

  async getSchools(params?: SchoolQueryParams) {
    const resp = await this.request.get<SchoolEntity[]>('/schools', {
      keywords: params?.keywords,
      is_deleted: params?.is_deleted,
      schoolDemandStatus:
        params?.schoolDemandStatus?.length > 0
          ? params?.schoolDemandStatus
          : undefined,
    });
    return resp.data;
  }

  async getSchool(schoolId: string) {
    const resp = await this.request.get<SchoolEntity>(`/schools/${schoolId}`);
    return resp.data;
  }

  async getSchoolDemandDetails(scoolId: string) {
    const resp = await this.request.get<SchoolDemandDetails>(
      `/schools/${scoolId}/details`
    );
    return resp.data;
  }

  async validateSchoolDemand(
    schoolId: string,
    validatedDemandPayload: ValidateSchoolDemandPayload
  ) {
    const resp = await this.request.put(
      `/schools/${schoolId}/validate`,
      validatedDemandPayload
    );
    return resp.data;
  }

  async updateSchoolStatus(
    schoolId: string,
    status: Extract<SchoolDemandStatus, 'PROCESSING' | 'SUSPENDED'>
  ) {
    const resp = await this.request.put(`/schools/${schoolId}/status`, {
      school_demand_status: status,
    });
    return resp.data;
  }
}
