import { useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Http from '../../utils/Http';
import { Me } from '../../types/Me';

export const getMe = async () => {
  return Http<Me>({
    method: 'GET',
    url: '/users/me',
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    retry: false,
    staleTime: 60_000,
    gcTime: 10 * 60_000,
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
      queryClient.removeQueries({ queryKey: ['me'] });
    },
  });
};
