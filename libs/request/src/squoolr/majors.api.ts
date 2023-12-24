import {
  CreateMajorPayload,
  DisableMajorsPayload,
  MajorEntity,
  QueryMajorParams,
  UpdateMajorPayload,
} from '@glom/data-types';
import { GlomRequest } from '../lib/glom-request';

export class MajorsApi {
  constructor(private readonly request: GlomRequest) {}

  async getMajors(params: QueryMajorParams) {
    const resp = await this.request.get<MajorEntity[]>('/majors', params);
    return resp.data;
  }

  async getMajor(annualMajorid: string) {
    const resp = await this.request.get<MajorEntity>(
      `/majors/${annualMajorid}`
    );
    return resp.data;
  }

  async createMajor(payload: CreateMajorPayload) {
    const resp = await this.request.post<MajorEntity>('/majors/new', payload);
    return resp.data;
  }

  async updateMajor(annualMajorId: string, updatePayload: UpdateMajorPayload) {
    const resp = await this.request.put(
      `/majors/${annualMajorId}`,
      updatePayload
    );
    return resp.data;
  }

  async disableMajor(annualMajorId: string) {
    const resp = await this.request.delete(`/majors/${annualMajorId}`);
    return resp.data;
  }

  async disableManyMajors(payload: DisableMajorsPayload) {
    const resp = await this.request.delete(`/majors`, {
      queryParams: payload,
    });
    return resp.data;
  }
}
