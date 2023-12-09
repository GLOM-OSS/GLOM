import {
    ClassroomEntity,
    QueryClassroomParams,
    UpdateClassroomPayload
} from '@glom/data-types';
import { GlomRequest } from '../lib/glom-request';

export class ClassroomsApi {
  constructor(private readonly request: GlomRequest) {}

  async getClassrooms(params: QueryClassroomParams) {
    const resp = await this.request.get<ClassroomEntity[]>(
      '/classrooms',
      params
    );
    return resp.data;
  }

  async updateClassroom(
    annualClassroomId: string,
    updatePayload: UpdateClassroomPayload
  ) {
    const resp = await this.request.put(
      `/classrooms/${annualClassroomId}`,
      updatePayload
    );
    return resp.data;
  }

  async disableClassroom(annualClassroomId: string) {
    const resp = await this.request.delete(`/classrooms/${annualClassroomId}`);
    return resp.data;
  }

  async disableManyClassrooms(annualClassroomIds: string[]) {
    const resp = await this.request.delete(`/classrooms`, {
      queryParams: { annualClassroomIds },
    });
    return resp.data;
  }
}
