import {
  BulkDisableStaffPayload,
  CreateStaffPayload,
  ResetStaffPasswordPayload,
  StaffQueryParams,
  StaffRole,
  UpdateStaffPayload
} from '@glom/data-types/squoolr';
import { useMutation, useQuery } from '@tanstack/react-query';
import squoolrApi from './api';
const { staffs } = squoolrApi;

export function useStaffMembers(params?: StaffQueryParams) {
  return useQuery({
    queryKey: ['get-staff-members', params],
    queryFn: () => staffs.getStaffMembers(params),
    initialData: [],
  });
}

export function useStaffMember(annualStaffId: string, role: StaffRole) {
  return useQuery({
    enabled: !!annualStaffId,
    queryKey: ['get-staff-member', annualStaffId],
    queryFn: () => staffs.getStaffMember(annualStaffId, role),
  });
}

export function useCreateStaffMember() {
  return useMutation({
    mutationKey: ['add-new-staff-member'],
    mutationFn: (newStaff: CreateStaffPayload) => staffs.createStaff(newStaff),
  });
}

export function useUpdateStaffMember(annualStaffId: string) {
  return useMutation({
    mutationKey: ['update-staff-member', annualStaffId],
    mutationFn: (payload: UpdateStaffPayload) =>
      staffs.updateStaff(annualStaffId, payload),
  });
}

export function useDisableStaffMember(annualStaffId: string) {
  return useMutation({
    mutationKey: ['disable-staff-member', annualStaffId],
    mutationFn: (role: StaffRole) => staffs.disableStaff(annualStaffId, role),
  });
}

export function useDisableStaffMembers() {
  return useMutation({
    mutationKey: ['disable-many-staff-member'],
    mutationFn: (staffPayload: BulkDisableStaffPayload) =>
      staffs.disableManyStaff(staffPayload),
  });
}

export function useResetStaffPasswords() {
  return useMutation({
    mutationKey: ['reset-many-staff-member'],
    mutationFn: (staffPayload: ResetStaffPasswordPayload) =>
      staffs.resetStaffPasswords(staffPayload),
  });
}
