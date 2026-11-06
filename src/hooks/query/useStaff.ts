import { useQuery } from '@tanstack/react-query';

import { staffControllerGetAllStaffPositions } from '../../api/staff-positions/staff-positions';
import { DepartmentWithPositions } from '../../types/Staff';

export const fetchStaff = async () => {
  const response = await (staffControllerGetAllStaffPositions() as unknown as Promise<
    DepartmentWithPositions[]
  >);
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
