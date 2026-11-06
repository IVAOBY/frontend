import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { authControllerLogout } from '../../api/authentication/authentication';
import { usersControllerGetMyProfile } from '../../api/users/users';
import { Me } from '../../types/Me';

export const getMe = async (): Promise<Me | null> => {
  try {
    return (await usersControllerGetMyProfile()) as unknown as Me;
  } catch (error) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      return null;
    }
    throw error;
  }
};

export const useMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    retry: false,
    staleTime: 0,
    gcTime: 0,
    throwOnError: false,
  });
};

export const logout = async () => {
  return authControllerLogout({ goto: window.location.href });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['me'] });
    },
  });
};
