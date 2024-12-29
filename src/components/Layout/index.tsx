import React, { FC, PropsWithChildren, ReactNode } from 'react';

import { Breadcrumb } from '../Breadcrumb';

export const Centered: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      {children}
    </div>
  );
};

export const GeneralLayout: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-8 pt-36">
      {children}
    </div>
  );
};

export const BreadcrumbLayout: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-8 pt-36">
      <Breadcrumb />
      {children}
    </div>
  );
};
