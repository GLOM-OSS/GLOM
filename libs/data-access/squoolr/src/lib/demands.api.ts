import { useNotification } from '@squoolr/toast';
import { useMutation, useQuery } from '@tanstack/react-query';

import squoolrApi from './api';
import { SubmitSchoolDemandPayload } from '@glom/data-types';
const { demands } = squoolrApi;

export function useSubmitDemand() {
  //TODO const notif = new useNotification();
  return useMutation({
    mutationKey: ['submit-school-demand'],
    mutationFn: (payload: SubmitSchoolDemandPayload) =>
      demands.submitDemand(payload),
    onMutate() {
      // notif.update({
      //   render: 'Submitting school demand...',
      // });
    },
    onSuccess() {
      // notif.update({
      //   render: 'Demand submitted successfully !!!',
      // });
    },
    onError(error) {
      console.log(error);
      // notif.update({
      //   render: error.message,
      //   autoClose: false,
      //   type: 'ERROR',
      // });
    },
  });
}

export const getSchoolDemand = (schoolId: string) =>
  demands.getDemand(schoolId);

export function useSchoolDemand(schoolId: string) {
  return useQuery({
    enabled: !!schoolId,
    queryKey: ['get-school-demand'],
    queryFn: () => demands.getDemand(schoolId),
  });
}

export function useSchoolDemands() {
  return useQuery({
    queryKey: ['get-school-demands'],
    queryFn: () => demands.getDemands(),
  });
}

export function useSchoolDemandDetails(schoolId: string) {
  return useQuery({
    queryKey: ['get-school-demand-details'],
    queryFn: () => demands.getDemandDetails(schoolId),
  });
}
