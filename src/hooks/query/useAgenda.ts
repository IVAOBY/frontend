import { useAgendaGetAgenda } from '../../api/agenda/agenda';

const useAgenda = () => {
  return useAgendaGetAgenda(
    { limit: 4 },
    {
      query: {
        retry: (failureCount) => failureCount <= 5,
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
      },
    },
  );
};

export default useAgenda;
