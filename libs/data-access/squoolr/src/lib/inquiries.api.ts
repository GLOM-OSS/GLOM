import { useMutation } from '@tanstack/react-query';

import { CreateInquiryPayload } from '@glom/data-types';
import squoolrApi from './api';
const { inquiries } = squoolrApi;

export function useSubmitInquiry() {
  // TODO const notif = new useNotification();
  return useMutation({
    mutationKey: ['submit-new-inquiry'],
    mutationFn: (payload: CreateInquiryPayload) =>
      inquiries.createInquiry(payload),
    onMutate() {
      // notif.notify({
      //   render: 'Submitting inquiry...',
      // });
    },
    onSuccess() {
      // notif.update({
      //   render: 'Inquiry submitted successfully !!!',
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
