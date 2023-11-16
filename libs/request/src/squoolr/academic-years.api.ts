import {
  AcademicYearEntity,
  CreateAcademicYearPayload,
  UserAnnualRoles,
} from '@glom/data-types';
import { GlomRequest } from '../lib/glom-request';

export class AcademicYearApi {
  constructor(private readonly request: GlomRequest) {}

  async getAcademiYears() {
    const resp = await this.request.get<AcademicYearEntity[]>(
      '/academic-years'
    );
    return resp.data;
  }

  async createAcademicYear(newAcademicYear: CreateAcademicYearPayload) {
    const resp = await this.request.post<AcademicYearEntity>(
      '/academic-years/new',
      newAcademicYear
    );
    return resp.data;
  }

  async selectActiveYear(academicYearId: string) {
    const resp = await this.request.patch<UserAnnualRoles>(
      `/academic-years/${academicYearId}/choose`,
      {}
    );
    return resp.data;
  }
}
