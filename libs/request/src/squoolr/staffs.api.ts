import {
  BatchUpdatePayload,
  BulkDisableStaffPayload,
  CreateStaffPayload,
  ManageStaffRolesPayload,
  ResetStaffPasswordPayload,
  StaffCreateResponseType,
  StaffEntity,
  StaffQueryParams,
  StaffRole,
  UpdateStaffPayload
} from '@glom/data-types/squoolr';
import { GlomRequest } from '../lib/glom-request';

export class StaffApi {
  constructor(private readonly request: GlomRequest) {}

  async getStaffMembers(params?: StaffQueryParams) {
    const resp = await this.request.get<StaffEntity[]>('/staffs', params);
    return resp.data;
  }

  async getStaffMember<T extends StaffCreateResponseType>(
    annualStaffId: string,
    role: StaffRole
  ) {
    const resp = await this.request.get<T>(`/staffs/${annualStaffId}`, {
      role,
    });
    return resp.data;
  }

  async createStaff<T extends StaffCreateResponseType>(
    newStaff: CreateStaffPayload
  ) {
    const resp = await this.request.post<T>('/staffs/new', newStaff);
    return resp.data;
  }

  async updateStaff(annualStaffId: string, payload: UpdateStaffPayload) {
    const resp = await this.request.put(`/staffs/${annualStaffId}`, payload);
    return resp.data;
  }

  async disableStaff(annualStaffId: string, role: StaffRole) {
    const resp = await this.request.delete(`/staffs/${annualStaffId}`, {
      queryParams: { role },
    });
    return resp.data;
  }

  async disableManyStaff(disabledStaff: BulkDisableStaffPayload) {
    const resp = await this.request.delete(`/staffs`, {
      queryParams: disabledStaff,
    });
    return resp.data;
  }

  async resetStaffPasswords(staffPayload: ResetStaffPasswordPayload) {
    const resp = await this.request.post(
      `/staffs/reset-passwords`,
      staffPayload
    );
    return resp.data;
  }

  async updateStaffRoles(
    loginId: string,
    staffPayload: ManageStaffRolesPayload
  ) {
    const resp = await this.request.put<BatchUpdatePayload>(
      `/staffs/${loginId}/roles`,
      staffPayload
    );
    return resp.data;
  }

  async resetStaffPrivateCodes(staffPayload: ResetStaffPasswordPayload) {
    const resp = await this.request.put<BatchUpdatePayload>(
      '/staffs/private-codes',
      staffPayload
    );
    return resp.data;
  }
}
