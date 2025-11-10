import React, { createContext, useContext } from 'react';

import Http from '../utils/Http';

type ApiFunction = <T = any>(url: string) => Promise<T>;

const ApiContext = createContext<ApiFunction | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const api: ApiFunction = async (url) => {
    return Http({ url, method: 'GET' });
  };

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};

export const useApi = (): ApiFunction => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
