import React, { ReactNode } from 'react';

interface TitleProps {
  children: ReactNode;
  description?: string;
  descriptionStyle?: string;
  className?: string;
}

export const Title: React.FC<TitleProps> = ({
  children,
  className,
  description,
  descriptionStyle,
}) => {
  return (
    <div className="mb-1 flex flex-col gap-1">
      <h2
        className={`text-center text-3xl font-bold text-atmos-700 ${className}`}
      >
        {children}
      </h2>
      <hr className="mx-auto h-1 w-24 rounded border-0 bg-atmos-700 dark:bg-gray-700" />
      {description ? (
        <div
          className={`text-center text-xl font-normal leading-7 text-gray-400 ${descriptionStyle}`}
        >
          {description}
        </div>
      ) : null}
    </div>
  );
};
