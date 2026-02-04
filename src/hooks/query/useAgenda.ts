import { useQuery } from '@tanstack/react-query';

import { Agenda } from '../../types/News';
import Http from '../../utils/Http';

export const fetchAgendaMain = async () => {
  const response = await Http<Agenda[]>({
    method: 'GET',
    url: `/agenda?limit=4`,
  });
  return response || [];
};

const useNews = () => {
  return useQuery({
    queryKey: ['agenda'],
    queryFn: async () => {
      return await fetchAgendaMain();
    },
    retry: (failureCount) => {
      return failureCount <= 5;
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export default useNews;
