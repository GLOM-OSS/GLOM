import {
  CoordinatorEntity,
  CreateStaffPayload,
  ManageStaffRolesPayload,
  StaffEntity,
  StaffQueryParams,
  StaffRole,
  TeacherEntity,
  UpdateStaffPayload,
} from '@glom/data-types/squoolr';
import { GlomRequest } from '../lib/glom-request';

type CreateResponseType = StaffEntity | TeacherEntity | CoordinatorEntity;
export class StaffApi {
  constructor(private readonly request: GlomRequest) {}

  async getStaffMembers(params?: StaffQueryParams) {
    return this.request.get<StaffEntity>('/staffs', params);
  }

  async getStaffMember(annualStaffId: string, role: StaffRole) {
    return this.request.get<CreateResponseType>(`/staffs/${annualStaffId}`, {
      role,
    });
  }

  async createStaff(newStaff: CreateStaffPayload) {
    return this.request.post<CreateResponseType>('/staffs/new', newStaff);
  }

  async updateStaff(annualStaffId: string, payload: UpdateStaffPayload) {
    return this.request.put(`/staffs/${annualStaffId}`, payload);
  }

  async disableStaff(annualStaffId: string, role: StaffRole) {
    return this.request.delete(`/staffs/${annualStaffId}`, {
      queryParams: { role },
    });
  }

  async disableManyStaff(disabledStaff: ManageStaffRolesPayload) {
    return this.request.delete(`/staffs`, { queryParams: { disabledStaff } });
  }

  async resetStaffPasswords(staffPayload: ManageStaffRolesPayload) {
    return this.request.post(`/staffs/reset-passwords`, staffPayload);
  }
}
