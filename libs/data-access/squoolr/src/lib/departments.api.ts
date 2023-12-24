import {
    CreateDepartmentPayload,
    QueryParams,
    UpdateDepartmentPayload,
} from '@glom/data-types';
import { useMutation, useQuery } from '@tanstack/react-query';

import squoolrApi from './api';
const { departments } = squoolrApi;

export function useDepartments(params?: QueryParams) {
  return useQuery({
    queryKey: ['fetch-school-departments', params],
    queryFn: () => departments.getDepartments(params),
    initialData: [],
  });
}

export function useCreateDepartment() {
  const mutationFn = (payload: CreateDepartmentPayload) =>
    departments.createDepartment(payload);
  return useMutation({
    mutationFn,
    mutationKey: ['create-new-department'],
    onError(error) {
      console.log(error);
      //TODO const notif = new useNotification();
    },
  });
}

export function useUpdateDepartment(departmentId: string) {
  const mutationFn = (updatePayload: UpdateDepartmentPayload) =>
    departments.updateDepartment(departmentId, updatePayload);
  return useMutation({
    mutationFn,
    mutationKey: ['update-department', departmentId],
    onError(error) {
      console.log(error);
      //TODO const notif = new useNotification();
    },
  });
}

export function useDisableDepartment(departmentId: string) {
  const mutationFn = () => departments.disableDepartment(departmentId);
  return useMutation({
    mutationFn,
    mutationKey: ['disable-department', departmentId],
    onError(error) {
      console.log(error);
      //TODO const notif = new useNotification();
    },
  });
}

export function useDisableDepartments() {
  const mutationFn = (departmentIds: string[]) =>
    departments.disableManyDepartments(departmentIds);
  return useMutation({
    mutationFn,
    mutationKey: ['disable-many-departments'],
    onError(error) {
      console.log(error);
      //TODO const notif = new useNotification();
    },
  });
}
