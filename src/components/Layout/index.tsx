import React, { FC, PropsWithChildren, ReactNode } from 'react';

import { Title } from '../Typography/Title';

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
    <div className="container mx-auto max-w-screen-lg py-8 px-4 xl:px-0">
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
    <div className="container mx-auto max-w-screen-lg py-8 px-4 xl:px-0">
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
