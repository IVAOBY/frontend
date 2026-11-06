import { useQuery } from '@tanstack/react-query';

import { agendaControllerGetAgenda } from '../../api/agenda/agenda';
import { Agenda } from '../../types/News';

export const fetchAgendaMain = async () => {
  const response = await (agendaControllerGetAgenda({
    limit: 4,
  }) as unknown as Promise<Agenda[]>);
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
