import { createContext, ReactNode, useContext } from 'react';

import { notifications } from '@mantine/notifications';
import { IconCircleX } from '@tabler/icons-react';
import axios from 'axios';

import { AuthContext } from './UserContext';

interface ApiContextType {
  api: (path: string, method?: string, body?: any) => Promise<any>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useApi = () => useContext(ApiContext);

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
    try {
      const config = {
        url:
          import.meta.env.VITE_API_URL_BASE + path || 'http://localhost:3000',
        method,
        headers,
        data: '',
      };

      if (body !== null) {
        config.data = body;
      }

      const response = await axios(config);

      const result = response.data;
      if (result && !result.status) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return result;
      } else {
        return false;
      }
    } catch (error: any) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || 'Something went wrong';
        notifications.show({
          title: 'Oops',
          message: errorMessage,
          color: 'red',
          radius: 'lg',
          icon: <IconCircleX />,
        });
        return false;
      } else {
        notifications.show({
          title: 'Oops',
          message: error.message || 'Something went wrong',
          color: 'red',
          radius: 'lg',
          icon: <IconCircleX />,
        });
      }
      return false;
    }
  };

  return <ApiContext.Provider value={{ api }}>{children}</ApiContext.Provider>;
};
