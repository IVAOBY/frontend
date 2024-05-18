import React, { ReactNode } from 'react';

interface TitleProps {
  children: ReactNode;
  description?: string;
  descriptionStyle?: string;
  className?: string;
  withUndreline?: boolean;
}

export const Title: React.FC<TitleProps> = ({
  children,
  className,
  description,
  descriptionStyle,
  withUndreline,
}) => {
  const isLeftOrRight =
    className &&
    (className.includes('text-left') || className.includes('text-right'));

  const titleClassNames = `text-3xl font-bold text-atmos-700 ${className} ${isLeftOrRight ? '' : 'text-center'}`;

  return (
    <div className="mb-1 flex flex-col gap-1">
      <h2 className={titleClassNames}>{children}</h2>
      {withUndreline && (
        <hr className="mx-auto h-1 w-24 rounded border-0 bg-atmos-700 dark:bg-gray-700" />
      )}
      {description && (
        <div
          className={`text-xl font-normal leading-7 text-gray-400 ${descriptionStyle}`}
        >
          {description}
        </div>
      )}
    </div>
  );
};
