import axios from 'axios';

import type { AxiosError, AxiosRequestConfig } from 'axios';

import { getAuthLoginUrl } from '../constants/app';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.by.ivao.aero';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes('/users/me')
    ) {
      window.location.href = getAuthLoginUrl(window.location.href);
    }
    return Promise.reject(error);
  },
);

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> =>
  axiosInstance<T>({ ...config, ...options }).then(({ data }) => data);

export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;
