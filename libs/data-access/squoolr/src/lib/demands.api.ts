import { useMutation, useQuery } from '@tanstack/react-query';

import {
  DemandStatus,
  SubmitSchoolDemandPayload,
  ValidateSchoolDemandPayload,
} from '@glom/data-types';
import squoolrApi from './api';
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

export function useSchoolDemands(demandStatus?: DemandStatus[]) {
  return useQuery({
    queryKey: ['get-school-demands'],
    queryFn: () => demands.getDemands(demandStatus),
  });
}

export function useSchoolDemandDetails(schoolId: string) {
  return useQuery({
    enabled: !!schoolId,
    queryKey: ['get-school-demand-details'],
    queryFn: () => demands.getDemandDetails(schoolId),
  });
}

export function useValidateDemand(schoolId: string) {
  return useMutation({
    mutationKey: ['validate-school-demand'],
    mutationFn: (payload: ValidateSchoolDemandPayload) =>
      demands.validateDemand(schoolId, payload),
  });
}

export function useUpdateDemandStaus(schoolId: string) {
  return useMutation({
    mutationKey: ['update-school-demand-status'],
    mutationFn: (
      schoolDemandStaus: Extract<DemandStatus, 'PROCESSING' | 'SUSPENDED'>
    ) => demands.updateDemandStatus(schoolId, schoolDemandStaus),
  });
}
