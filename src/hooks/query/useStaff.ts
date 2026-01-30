import { useQuery } from '@tanstack/react-query';

import { DepartmentWithPositions } from '../../types/Staff';
import Http from '../../utils/Http';

export const fetchStaff = async () => {
  const response = await Http<DepartmentWithPositions[]>({
    method: 'GET',
    url: `/staff/positions`,
  });
  return response || [];
};

export const useStaff = () => {
  return useQuery({
    queryKey: ['staff', 'positions'],
    queryFn: async () => {
      return await fetchStaff();
    },
    retry: (failureCount) => {
      return failureCount <= 5;
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 120 * 60 * 1000,
  });
};