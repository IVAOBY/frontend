import { useQuery } from '@tanstack/react-query';

import { newsControllerGetAllNews, newsControllerGetNewsById } from '../../../api/news/news';
import { NewsEntity } from '../../../types/News';

export const fetchNews = async () => {
  return newsControllerGetAllNews() as unknown as Promise<NewsEntity[]>;
};

export const fetchNewsById = (id: string | undefined) => {
  return newsControllerGetNewsById(Number(id)) as unknown as Promise<NewsEntity>;
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
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
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
    staleTime: 120 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export default useNews;
