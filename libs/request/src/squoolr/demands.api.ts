import {
  SchoolEntity,
  SchoolDemandDetails,
  SubmitSchoolDemandPayload,
  ValidateSchoolDemandPayload,
} from '@glom/data-types/squoolr';
import { GlomRequest } from '../lib/glom-request';

export class DemandsApi {
  constructor(private readonly request: GlomRequest) {}

  submitDemand(schoolDemandPayload: SubmitSchoolDemandPayload) {
    return this.request.post<SchoolEntity>('/demands/new', schoolDemandPayload);
  }

  getDemands() {
    return this.request.get<SchoolEntity[]>('/demands');
  }

  getDemand(school_code: string) {
    return this.request.get<SchoolEntity>(`/demands/${school_code}`);
  }

  getDemandDetails(school_code: string) {
    return this.request.get<SchoolDemandDetails>(
      `/demands/${school_code}/details`
    );
  }

  validateDemand(
    school_code: string,
    validatedDemandPayload: ValidateSchoolDemandPayload
  ) {
    return this.request.put(
      `/demands/${school_code}/validate`,
      validatedDemandPayload
    );
  }

  processDemand(school_code: string) {
    return this.request.patch(`/demands/${school_code}/status`, {});
  }
}
