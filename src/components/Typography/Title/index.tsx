import React, { ReactNode } from 'react';

interface TitleProps {
  children: ReactNode;
  className?: string;
}

export const Title: React.FC<TitleProps> = ({ children, className }) => {
  return (
    <div className="flex flex-col gap-1">
      <h2
        className={`text-center text-3xl font-bold text-atmos-700 ${className}`}
      >
        {children}
      </h2>
      <hr className="mx-auto h-1 w-24 rounded border-0 bg-atmos-700 dark:bg-gray-700" />
    </div>
  );
};
