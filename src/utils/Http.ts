import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const Http = Axios.create({
    baseURL: import.meta.env.VITE_API_URL_BASE as string,
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
    request.headers = request.headers ?? {};
    request.headers['Content-Type'] = 'application/json';

    const token = localStorage.getItem('token')
    if (token) {
        request.headers['Authorization'] = 'Bearer ' + token;
    }
    console.log('Request Headers:', request.headers);
    return request;
});


type HttpInterface = <T>(config: AxiosRequestConfig) => Promise<T>;

export type HttpEntity = { [key: string]: unknown };

export default Http as HttpInterface;