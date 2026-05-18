import axios, { AxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.by.ivao.aero';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`[HTTP] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('[HTTP Error]', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

async function Http<T = any>(config: AxiosRequestConfig): Promise<T> {
  const response = await axiosInstance(config);
  return response.data;
}

export default Http;