import { createContext, ReactNode, useContext } from 'react';

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { AuthContext } from './UserContext';

interface ApiContextType {
  api: (path: string, method?: string, body?: any) => Promise<any>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const useApi = () => {
  const context = useContext(ApiContext);

  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }

  return context.api;
};

type ApiProviderProps = {
  children: ReactNode;
};

export const ApiProvider = ({ children }: ApiProviderProps) => {
  const { token } = useContext(AuthContext);

  const api: ApiContextType['api'] = async (
    path: string,
    method: string = 'GET',
    body: any = null,
  ) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    };

    const config: AxiosRequestConfig = {
      url: 'https://api.by.ivao.aero' + path || 'http://localhost:3000',
      method,
      headers,
      data: body || undefined,
    };

    try {
      const response: AxiosResponse<any> = await axios(config);

      const result = response.data;
      if (result && !result.status) {
        return result;
      } else {
        return false;
      }
    } catch (error: any) {
      if (error.response) {
        return false;
      }
      return false;
    }
  };

  const contextValue: ApiContextType = {
    api,
  };

  return (
    <ApiContext.Provider value={contextValue}>{children}</ApiContext.Provider>
  );
};
