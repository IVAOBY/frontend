import {
  useDocumentsCategoryGetAllCategories,
  useDocumentsCategoryGetCategoryById,
} from '../../api/documents-category/documents-category';
import { useDocumentsGetDocumentById } from '../../api/documents/documents';

export const useCategory = () => {
  return useDocumentsCategoryGetAllCategories({
    query: { staleTime: 5 * 60 * 1000, gcTime: 30 * 60 * 1000 },
  });
};

export const useDocument = (id: string | undefined = undefined) => {
  return useDocumentsGetDocumentById(Number(id), {
    query: { enabled: !!id, staleTime: 60 * 1000, gcTime: 120 * 60 * 1000 },
  });
};

export const useCategoryId = (id: string | undefined = undefined) => {
  return useDocumentsCategoryGetCategoryById(Number(id), {
    query: { enabled: !!id, staleTime: 5 * 60 * 1000, gcTime: 30 * 60 * 1000 },
  });
};
