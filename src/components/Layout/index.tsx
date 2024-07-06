import React, { FC, PropsWithChildren, ReactNode } from 'react';

import { Title } from '../Typography/Title';
import {Breadcrumb} from "../Breadcrumb";

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

interface LayoutTitleProps {
  children: ReactNode;
  className?: string;
  description?: string;
  descriptionStyle?: string;
  title: string;
  withUnderline?: boolean;
}

export const LayoutTitle: React.FC<LayoutTitleProps> = ({
  children,
  className,
  description,
  descriptionStyle,
  title,
  withUnderline,
}) => {
  return (
    <div className="container mx-auto max-w-screen-lg px-4 py-8 xl:px-0">
      <Title
        className={className}
        description={description}
        descriptionStyle={descriptionStyle}
        withUndreline={withUnderline}
      >
        {title}
      </Title>
      {children}
    </div>
  );
};
