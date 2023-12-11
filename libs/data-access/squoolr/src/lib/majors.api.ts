import { CreateMajorPayload, QueryMajorParams } from '@glom/data-types';
import { useMutation, useQuery } from '@tanstack/react-query';

import squoolrApi from './api';
const { majors } = squoolrApi;

export function useMajors(params?: QueryMajorParams) {
  return useQuery({
    queryKey: ['fetch-school-majors'],
    queryFn: () => majors.getMajors(params),
    initialData: [],
  });
}

export function useMajor(annualMajorId: string) {
  return useQuery({
    enabled: !!annualMajorId,
    queryKey: ['fetch-school-major'],
    queryFn: () => majors.getMajor(annualMajorId),
  });
}

export function useCreateMajor() {
  const mutationFn = (payload: CreateMajorPayload) =>
    majors.createMajor(payload);
  return useMutation({
    mutationFn,
    mutationKey: ['create-new-major'],
    onError(error) {
      console.log(error);
      //TODO const notif = new useNotification();
    },
  });
}

export function useUpdateMajor(annualMajorId: string) {
  const mutationFn = (payload: CreateMajorPayload) =>
    majors.updateMajor(annualMajorId, payload);
  return useMutation({
    mutationFn,
    mutationKey: ['update-major', annualMajorId],
    onError(error) {
      console.log(error);
      //TODO const notif = new useNotification();
    },
  });
}

export function useDisableMajor(annualMajorId: string) {
  const mutationFn = () => majors.disableMajor(annualMajorId);
  return useMutation({
    mutationFn,
    mutationKey: ['disable-major', annualMajorId],
    onError(error) {
      console.log(error);
      //TODO const notif = new useNotification();
    },
  });
}

export function useDisableMajors() {
  const mutationFn = (annualMajorIds: string[]) =>
    majors.disableManyMajors(annualMajorIds);
  return useMutation({
    mutationFn,
    mutationKey: ['disable-many-majors'],
    onError(error) {
      console.log(error);
      //TODO const notif = new useNotification();
    },
  });
}
