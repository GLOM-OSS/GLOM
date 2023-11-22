import { useMutation } from '@tanstack/react-query';
import { EntryFeePaymentPayload } from '@glom/data-types';

import squoolrApi from './api';
const { payments } = squoolrApi;

export function useInitEntryFeePayment() {
  return useMutation({
    mutationKey: ['init-entry-fee-payment'],
    mutationFn: (payload: EntryFeePaymentPayload) =>
      payments.initEntryFeeApi(payload),
    onError(error) {
      console.log(error);
      //TODO const notif = new useNotification();
    },
  });
}
