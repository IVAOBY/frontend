import { useQuery } from '@tanstack/react-query';

import { DepartmentStaff, PositionStaff } from '../../types/Staff';
import Http from '../../utils/Http';

export const fetchDepartments = async () => {
  return Http<DepartmentStaff[]>({
    method: 'GET',
    url: `/staff-departments`,
  });
};

export const fetchStaff = async () => {
  const response = await Http<PositionStaff[]>({
    method: 'GET',
    url: `/staff-positions`,
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

export const useStaffDepartment = () => {
  return useQuery({
    queryKey: ['staff', 'departments'],
    queryFn: async () => {
      return await fetchDepartments();
    },
    retry: (failureCount) => {
      return failureCount <= 5;
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 120 * 60 * 1000,
  });
};
