import {
  BulkDisableStaffPayload,
  CreateStaffPayload,
  ManageStaffRolesPayload,
  ResetStaffPasswordPayload,
  StaffCreateResponseType,
  StaffQueryParams,
  StaffRole,
  UpdateStaffPayload,
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

export function useStaffMember<T extends StaffCreateResponseType>(
  annualStaffId: string,
  role: StaffRole
) {
  return useQuery({
    enabled: !!annualStaffId,
    queryKey: ['get-staff-member', annualStaffId],
    queryFn: () => staffs.getStaffMember<T>(annualStaffId, role),
  });
}

export function useCreateStaffMember<T extends StaffCreateResponseType>() {
  return useMutation({
    mutationKey: ['add-new-staff-member'],
    mutationFn: (newStaff: CreateStaffPayload) =>
      staffs.createStaff<T>(newStaff),
    onError(error) {
      console.log(error);
      //TODO const notif = new useNotification();
    },
  });
}

export function useUpdateStaffMember(annualStaffId: string) {
  return useMutation({
    mutationKey: ['update-staff-member', annualStaffId],
    mutationFn: (payload: UpdateStaffPayload) =>
      staffs.updateStaff(annualStaffId, payload),
    onError(error) {
      console.log(error);
      //TODO const notif = new useNotification();
    },
  });
}

export function useDisableStaffMember(annualStaffId: string) {
  return useMutation({
    mutationKey: ['disable-staff-member', annualStaffId],
    mutationFn: (role: StaffRole) => staffs.disableStaff(annualStaffId, role),
    onError(error) {
      console.log(error);
      //TODO const notif = new useNotification();
    },
  });
}

export function useDisableStaffMembers() {
  return useMutation({
    mutationKey: ['disable-many-staff-member'],
    mutationFn: (staffPayload: BulkDisableStaffPayload) =>
      staffs.disableManyStaff(staffPayload),
    onError(error) {
      console.log(error);
      //TODO const notif = new useNotification();
    },
  });
}

export function useResetStaffPasswords() {
  return useMutation({
    mutationKey: ['reset-many-staff-member'],
    mutationFn: (staffPayload: ResetStaffPasswordPayload) =>
      staffs.resetStaffPasswords(staffPayload),
    onError(error) {
      console.log(error);
      //TODO const notif = new useNotification();
    },
  });
}

export function useManageStaffRoles(loginId: string) {
  return useMutation({
    mutationKey: ['manage-staff-member-roles'],
    mutationFn: (staffPayload: ManageStaffRolesPayload) =>
      staffs.updateStaffRoles(loginId, staffPayload),
    onError(error) {
      console.log(error);
      //TODO const notif = new useNotification();
    },
  });
}
