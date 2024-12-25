import { useQuery } from '@tanstack/react-query';

import Http from '../../utils/Http';
import {Agenda} from '../../types/News';

export const fetchAgendaMain = async () => {
    try {
        const response = await Http<Agenda[]>({
            method: 'GET',
            url: `/agenda?limit=4`,
        });
        return response || [];
    } catch (error) {
        console.error('Error fetching agenda:', error);
        throw error;
    }
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
    });
};




export default useNews;