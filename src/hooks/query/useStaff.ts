import { useStaffGetAllStaffPositions } from '../../api/staff-positions/staff-positions';

export const useStaff = () => {
  return useStaffGetAllStaffPositions({
    query: {
      retry: (failureCount) => failureCount <= 5,
      staleTime: 30 * 60 * 1000,
      gcTime: 120 * 60 * 1000,
    },
  });
};
