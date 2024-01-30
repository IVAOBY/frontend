import React, { ReactNode } from 'react';

import { Title } from '../Typography/Title';

export const GeneralLayout: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <div className="container mx-auto max-w-screen-xl py-8">{children}</div>
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
    <div className="container mx-auto max-w-screen-xl py-8">
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
