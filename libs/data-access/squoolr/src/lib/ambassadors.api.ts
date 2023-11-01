import { useQuery } from '@tanstack/react-query';

import squoolrApi from './api';
const { ambassadors } = squoolrApi;

export function useVerifyAmbassador(referralCode: string) {
  return useQuery({
    enabled: !!referralCode,
    queryKey: ['verify-ambassador-code', referralCode],
    queryFn: async () => {
      const ambassador = await ambassadors.verifyReferralCode(referralCode);
      return !!ambassador;
    },
  });
}
