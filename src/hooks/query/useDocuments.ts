import { useQuery } from '@tanstack/react-query';

import Http from '../../utils/Http';
import {DocumentsCategoryType, DocumentsType} from "../../types/Documents";

export const fetchDocumentsCategory = async () => {
    return Http<DocumentsCategoryType[]>({
        method: 'GET',
        url: `/documents-category`,
    });
};

export const fetchDocumentById = (id: string | undefined) => {
    return Http<DocumentsType>({
        method: 'GET',
        url: `/documents/${id}`,
    });
};

export const fetchCategoryById = (id: string | undefined) => {
    return Http<DocumentsCategoryType>({
        method: 'GET',
        url: `/documents-category/${id}`,
    });
};

export const useCategory = () => {
    return useQuery({
        queryKey: ['documents'],
        queryFn: async () => {
            return await fetchDocumentsCategory();
        },
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
    });
};

export const useCategoryId = (id: string | undefined = undefined) => {
    return useQuery({
        queryKey: ['documents', id],
        queryFn: async () => {
            if (!id) throw new Error('Document Category ID is required for fetching data.');
            return await fetchCategoryById(id);
        },
        enabled: !!id,
    });
};