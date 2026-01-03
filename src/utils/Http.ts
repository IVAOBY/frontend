import Axios, {AxiosError, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse} from 'axios';

import { API_BASE_URL, STORAGE_KEYS } from '../constants/app';

const Http = Axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

Http.interceptors.response.use(
  (response) => response.data as AxiosResponse,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response && error.response.status === 401) {
      window.location.reload();
    }
    if (error.response?.data?.message)
      return Promise.reject(new Error(error.response.data.message));

    return Promise.reject(error);
  },
);

Http.interceptors.request.use((request) => {
    request.headers = request.headers ?? {} as AxiosRequestHeaders;
    request.headers['Content-Type'] = 'application/json';

  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    request.headers['Authorization'] = 'Bearer ' + token;
  }

  return request;
});

type HttpInterface = <T>(config: AxiosRequestConfig) => Promise<T>;

export type HttpEntity = { [key: string]: unknown };

export default Http as HttpInterface;
