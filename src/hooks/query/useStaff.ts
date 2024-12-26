import { useQuery } from '@tanstack/react-query';

import Http from '../../utils/Http';
import {DepartmentStaff, PositionStaff} from "../../types/Staff";

export const fetchDepartments = async () => {
    return Http<DepartmentStaff[]>({
        method: 'GET',
        url: `/staff-departments`,
    });
};

export const fetchStaff = async () => {
    try {
        const response = await Http<PositionStaff[]>({
            method: 'GET',
            url: `/staff-positions`,
        });
        return response || [];
    } catch (error) {
        console.error('Error fetching staff:', error);
        throw error;
    }
};

export const useStaff = () => {
    return useQuery({
        queryKey: ['staff', 'positions'],
        queryFn: async () => {
            return await fetchStaff();
        },
        retry: (failureCount) => {
            return failureCount <= 5;
        },
    });
};

export const useStaffDepartment = () => {
    return useQuery({
        queryKey: ['staff', 'departments'],
        queryFn: async () => {
            return await fetchDepartments();
        },
        retry: (failureCount) => {
            return failureCount <= 5;
        },
    });
};

