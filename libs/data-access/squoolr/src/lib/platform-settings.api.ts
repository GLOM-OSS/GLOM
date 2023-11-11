import { useQuery } from '@tanstack/react-query';

import squoolrApi from './api';
const { platformSettings } = squoolrApi;

export function usePlatformSettings() {
  return useQuery({
    queryKey: ['get-platform-settings'],
    queryFn: () => platformSettings.getPlatformSettings(),
  });
}
