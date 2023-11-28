import { useMutation, useQuery } from '@tanstack/react-query';

import {
  SchoolDemandStatus,
  SchoolQueryParams,
  SubmitSchoolDemandPayload,
  ValidateSchoolDemandPayload,
} from '@glom/data-types';
import squoolrApi from './api';
const { schools: demands } = squoolrApi;

export function useSubmitSchoolDemand() {
  return useMutation({
    mutationKey: ['submit-school-demand'],
    mutationFn: (payload: SubmitSchoolDemandPayload) =>
      demands.submitSchoolDemand(payload),
    onError(error) {
      console.log(error);
      //TODO const notif = new useNotification();
    },
  });
}

export const getSchool = (schoolId: string) => demands.getSchool(schoolId);

export function useSchool(schoolId: string) {
  return useQuery({
    enabled: !!schoolId,
    queryKey: ['get-school-demand', schoolId],
    queryFn: () => demands.getSchool(schoolId),
  });
}

export function useSchools(params?: SchoolQueryParams) {
  return useQuery({
    queryKey: ['get-school-demands', params],
    queryFn: () => demands.getSchools(params),
  });
}

export function useSchoolDemandDetails(schoolId: string) {
  return useQuery({
    enabled: !!schoolId,
    queryKey: ['get-school-demand-details', schoolId],
    queryFn: () => demands.getSchoolDemandDetails(schoolId),
  });
}

export function useValidateSchoolDemand(schoolId: string) {
  return useMutation({
    mutationKey: ['validate-school-demand', schoolId],
    mutationFn: (payload: ValidateSchoolDemandPayload) =>
      demands.validateSchoolDemand(schoolId, payload),
  });
}

export function useUpdateSchoolStatus(schoolId: string) {
  return useMutation({
    mutationKey: ['update-school-demand-status', schoolId],
    mutationFn: (
      schoolDemandStaus: Extract<SchoolDemandStatus, 'PROCESSING' | 'SUSPENDED'>
    ) => demands.updateSchoolStatus(schoolId, schoolDemandStaus),
  });
}
