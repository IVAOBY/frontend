import { useQuery } from '@tanstack/react-query';

import Http from '../../../utils/Http';
import { NewsEntity } from '../../../types/News';

export const fetchNews = async () => {
    return Http<NewsEntity[]>({
        method: 'GET',
        url: `/news`,
    });
};

export const fetchNewsById = (id: string | undefined) => {
    return Http<NewsEntity>({
        method: 'GET',
        url: `/news/${id}`,
    });
};

const useNews = () => {
    return useQuery({
        queryKey: ['news'],
        queryFn: async () => {
            return await fetchNews();
        },
        retry: (failureCount) => {
            return failureCount <= 5;
        },
    });
};

export const useNewsById = (id: string | undefined = undefined) => {
    return useQuery({
        queryKey: ['news', id],
        queryFn: async () => {
            if (!id) throw new Error('News ID is required for fetching data.');
            return await fetchNewsById(id);
        },
        enabled: !!id,
        retry: false,
    });
};


export default useNews;