import {
    CreateDepartmentPayload,
    DepartmentEntity,
    QueryParams,
    UpdateDepartmentPayload
} from '@glom/data-types';
import { GlomRequest } from '../lib/glom-request';

export class DepartmentsApi {
  constructor(private readonly request: GlomRequest) {}

  async getDepartments(params: QueryParams) {
    const resp = await this.request.get<DepartmentEntity[]>(
      `/departments`,
      params
    );
    return resp.data;
  }

  async createDepartment(payload: CreateDepartmentPayload) {
    const resp = await this.request.post<DepartmentEntity>(
      `/departments/new`,
      payload
    );
    return resp.data;
  }

  async updateDepartment(
    departmentId: string,
    updatePayload: UpdateDepartmentPayload
  ) {
    const resp = await this.request.put(
      `/departments/${departmentId}`,
      updatePayload
    );
    return resp.data;
  }

  async disableDepartment(departmentId: string) {
    const resp = await this.request.delete(`/departments/${departmentId}`);
    return resp.data;
  }

  async disableManyDepartments(departmentIds: string[]) {
    const resp = await this.request.delete('/departments', {
      queryParams: { departmentIds },
    });
    return resp.data;
  }
}
