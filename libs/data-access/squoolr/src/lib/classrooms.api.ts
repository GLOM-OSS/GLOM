import { QueryClassroomParams, UpdateClassroomPayload } from '@glom/data-types';
import { useMutation, useQuery } from '@tanstack/react-query';

import squoolrApi from './api';
const { classrooms } = squoolrApi;

export function useClassrooms(params?: QueryClassroomParams) {
  return useQuery({
    queryKey: ['fetch-major-classrooms', params],
    queryFn: () => classrooms.getClassrooms(params),
  });
}

export function useUpdateClassroom(annualClassroomId: string) {
  const mutationFn = (updatePayload: UpdateClassroomPayload) =>
    classrooms.updateClassroom(annualClassroomId, updatePayload);
  return useMutation({
    mutationFn,
    mutationKey: ['update-classroom', annualClassroomId],
    onError(error) {
      console.log(error);
      //TODO const notif = new useNotification();
    },
  });
}

export function usDisableClassroom(annualClassroomId: string) {
  const mutationFn = () => classrooms.disableClassroom(annualClassroomId);
  return useMutation({
    mutationFn,
    mutationKey: ['disable-classroom', annualClassroomId],
    onError(error) {
      console.log(error);
      //TODO const notif = new useNotification();
    },
  });
}

export function useDisableClassrooms() {
  const mutationFn = (annualClassroomIds: string[]) =>
    classrooms.disableManyClassrooms(annualClassroomIds);
  return useMutation({
    mutationFn,
    mutationKey: ['disable-many-classrooms'],
    onError(error) {
      console.log(error);
      //TODO const notif = new useNotification();
    },
  });
}
