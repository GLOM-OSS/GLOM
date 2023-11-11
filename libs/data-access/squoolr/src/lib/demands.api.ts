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

export const getSchoolDemand = (demandCode: string) =>
  demands.getDemand(demandCode);

export function useSchoolDemand(schoolCode: string) {
  return useQuery({
    enabled: !!schoolCode,
    queryKey: ['get-school-demand'],
    queryFn: () => demands.getDemand(schoolCode),
  });
}
