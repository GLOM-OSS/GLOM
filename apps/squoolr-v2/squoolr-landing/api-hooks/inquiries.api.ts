import { useNotification } from '@squoolr/toast';
import { useMutation } from '@tanstack/react-query';

import squoolrApi from './api';
const { inquiries } = squoolrApi;

export function useSubmitInquiry() {
  const notif = new useNotification();
  return useMutation({
    mutationKey: ['submit-new-inquiry'],
    mutationFn: inquiries.createInquiry,
    onMutate() {
      notif.update({
        render: 'Submitting inquiry...',
      });
    },
    onSuccess() {
      notif.update({
        render: 'Inquiry submitted successfully !!!',
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
