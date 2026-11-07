import { useNewsGetAllNews, useNewsGetNewsById } from '../../../api/news/news';

const useNews = () => {
  return useNewsGetAllNews(undefined, {
    query: {
      retry: (failureCount) => failureCount <= 5,
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
    },
  });
};

export const useNewsById = (id: string | undefined = undefined) => {
  return useNewsGetNewsById(Number(id), {
    query: { enabled: !!id, staleTime: 120 * 1000, gcTime: 5 * 60 * 1000 },
  });
};

export default useNews;
