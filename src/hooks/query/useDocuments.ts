import { useQuery } from '@tanstack/react-query';

import { documentsCategoryControllerGetAllNews } from '../../api/documents-category/documents-category';
import { documentsCategoryControllerGetNewsById } from '../../api/documents-category/documents-category';
import { documentsControllerGetDocumentById } from '../../api/documents/documents';
import { DocumentsCategoryType, DocumentsType } from '../../types/Documents';

export const fetchDocumentsCategory = async () => {
  return documentsCategoryControllerGetAllNews() as unknown as Promise<
    DocumentsCategoryType[]
  >;
};

export const fetchDocumentById = (id: string | undefined) => {
  return documentsControllerGetDocumentById(
    Number(id),
  ) as unknown as Promise<DocumentsType>;
};

export const fetchCategoryById = (id: string | undefined) => {
  return documentsCategoryControllerGetNewsById(
    Number(id),
  ) as unknown as Promise<DocumentsCategoryType>;
};

export const useCategory = () => {
  return useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      return await fetchDocumentsCategory();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useDocument = (id: string | undefined = undefined) => {
  return useQuery({
    queryKey: ['document', id],
    queryFn: async () => {
      if (!id) throw new Error('Document ID is required for fetching data.');
      return await fetchDocumentById(id);
    },
    enabled: !!id,
    staleTime: 60 * 1000,
    gcTime: 120 * 60 * 1000,
  });
};

export const useCategoryId = (id: string | undefined = undefined) => {
  return useQuery({
    queryKey: ['documents', id],
    queryFn: async () => {
      if (!id)
        throw new Error('Document Category ID is required for fetching data.');
      return await fetchCategoryById(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
