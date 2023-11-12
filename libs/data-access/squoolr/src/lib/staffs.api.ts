import {
  CreateStaffPayload,
  ManageStaffRolesPayload,
  StaffQueryParams,
  StaffRole,
  UpdateStaffPayload
} from '@glom/data-types/squoolr';
import { useMutation, useQuery } from '@tanstack/react-query';
import squoolrApi from './api';
const { staffs } = squoolrApi;

export function useStaffMembers(params?: StaffQueryParams) {
  return useQuery({
    queryKey: ['get-staff-members'],
    queryFn: () => staffs.getStaffMembers(params),
  });
}

export function useStaffMember(annualStaffId: string, role: StaffRole) {
  return useQuery({
    enabled: !!annualStaffId,
    queryKey: ['get-staff-member', annualStaffId],
    queryFn: () => staffs.getStaffMember(annualStaffId, role),
  });
}

export function useCreateStaff() {
  return useMutation({
    mutationKey: ['add-new-staff'],
    mutationFn: (newStaff: CreateStaffPayload) => staffs.createStaff(newStaff),
  });
}

export function useUpdateStaff(annualStaffId: string) {
  return useMutation({
    mutationKey: ['update-staff-member', annualStaffId],
    mutationFn: (payload: UpdateStaffPayload) =>
      staffs.updateStaff(annualStaffId, payload),
  });
}

export function useDisableStaff(annualStaffId: string) {
  return useMutation({
    mutationKey: ['disable-staff-member', annualStaffId],
    mutationFn: (role: StaffRole) => staffs.disableStaff(annualStaffId, role),
  });
}

export function useDisableManyStaff() {
  return useMutation({
    mutationKey: ['disable-staff-many-member'],
    mutationFn: (staffPayload: ManageStaffRolesPayload) =>
      staffs.disableManyStaff(staffPayload),
  });
}
