import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { User } from '../../api/model';

import { authLogout } from '../../api/authentication/authentication';
import {
  getUsersGetMyProfileQueryKey,
  usersGetMyProfile,
} from '../../api/users/users';

const getMe = async (): Promise<User | null> => {
  try {
    return await usersGetMyProfile();
  } catch (error) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      return null;
    }
    throw error;
  }
};

export const useMe = () => {
  return useQuery({
    queryKey: getUsersGetMyProfileQueryKey(),
    queryFn: getMe,
    retry: false,
    staleTime: 0,
    gcTime: 0,
    throwOnError: false,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authLogout({ goto: window.location.href }),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: getUsersGetMyProfileQueryKey() });
    },
  });
};
