import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

import { getAuthLoginUrl } from '../../constants/app';

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
  (error) => {
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
  url: string,
  options?: RequestInit,
): Promise<T> => {
  const { method = 'GET', headers, body, signal } = options ?? {};

  const config: AxiosRequestConfig = {
    url,
    method,
    headers: headers as Record<string, string>,
    signal,
  };

  if (body !== undefined && body !== null) {
    const contentType =
      (headers as Record<string, string>)?.['Content-Type'] ?? '';
    if (contentType.includes('application/json') && typeof body === 'string') {
      config.data = JSON.parse(body);
    } else {
      config.data = body;
    }
  }

  return axiosInstance(config).then(({ data }) => data);
};
