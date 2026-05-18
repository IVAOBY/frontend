import { useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Http from '../../utils/Http';
import { Me } from '../../types/Me';

export const getMe = async (): Promise<Me | null> => {
  try {
    return await Http<Me>({
      method: 'GET',
      url: '/users/me',
      withCredentials: true,
    });
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
    staleTime: 60_000,
    gcTime: 10 * 60_000,
    throwOnError: false,
  });
};

export const logout = async () => {
  return Http({
    method: 'POST',
    url: '/auth/logout',
    withCredentials: true,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
};