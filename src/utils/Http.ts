import axios, { AxiosRequestConfig } from 'axios';
import { getAuthLoginUrl } from '../constants/app';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.by.ivao.aero';

const axiosInstance = axios.create({
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
  }
);

async function Http<T = any>(config: AxiosRequestConfig): Promise<T> {
  const response = await axiosInstance(config);
  return response.data;
}

export default Http;