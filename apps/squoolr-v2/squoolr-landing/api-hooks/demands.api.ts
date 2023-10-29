import { useNotification } from '@squoolr/toast';
import { useMutation, useQuery } from '@tanstack/react-query';

import squoolrApi from './api';
const { demands } = squoolrApi;

export function useSubmitDemand() {
  const notif = new useNotification();
  return useMutation({
    mutationKey: ['submit-school-demand'],
    mutationFn: demands.submitDemand,
    onMutate() {
      notif.update({
        render: 'Submitting school demand...',
      });
    },
    onSuccess() {
      notif.update({
        render: 'Demand submitted successfully !!!',
      });
    },
    onError(error) {
      notif.update({
        render: error.message,
        autoClose: false,
        type: 'ERROR',
      });
    },
  });
}

export function useSchoolDemand(schoolCode: string) {
  return useQuery({
    queryKey: ['get-school-demand'],
    queryFn: () => demands.getDemand(schoolCode),
  });
}
