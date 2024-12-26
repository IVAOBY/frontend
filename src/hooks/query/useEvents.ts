import { useQuery } from '@tanstack/react-query';

import Http from '../../utils/Http';
import { EventEntity } from '../../types/Events';

export const fetchEvent = (id: string | undefined) => {
    return Http<EventEntity>({
        method: 'GET',
        url: `/events/${id}`,
    });
};


const useEvent = (id: string | undefined = undefined) => {
    return useQuery({
        queryKey: ['event', id],
        queryFn: async () => {
            if (!id) throw new Error('Event ID is required for fetching data.');
            return await fetchEvent(id);
        },
        enabled: !!id,
        retry: false,
    });
};




export default useEvent;