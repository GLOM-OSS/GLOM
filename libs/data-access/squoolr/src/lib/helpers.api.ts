import { useQuery } from '@tanstack/react-query';

import squoolrApi from './api';
const { helpers } = squoolrApi;

export function useTeacherTypes() {
  return useQuery({
    queryKey: ['fetch-teacher-types'],
    queryFn: () => helpers.getTeacherTypes(),
  });
}

export function useTeachingGrades() {
  return useQuery({
    queryKey: ['fetch-teaching-grades'],
    queryFn: () => helpers.getTeachingGrades(),
  });
}

export function useCycles() {
  return useQuery({
    queryKey: ['fetch-cycles'],
    queryFn: () => helpers.getCycles(),
  });
}
