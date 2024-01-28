import { ButtonHTMLAttributes, ReactNode } from 'react';

import { classNames } from '../../utils/styles';

type ButtonVariants = 'primary' | 'secondary' | 'danger' | 'muted';
type Sizes = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  icon?: ReactNode;
  size?: Sizes;
  variant?: ButtonVariants;
  isFullWidth?: boolean;
}

const sizesVariants: { [key in Sizes]: string } = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-2 text-sm',
  xl: 'px-3 py-2 text-sm md:px-5 md:py-3 md:text-lg',
};

const colorsVariants: { [key in ButtonVariants]: string } = {
  primary:
    'dark:bg-semantic-green-600 bg-semantic-green-500 text-white hover:opacity-90 dark:hover:bg-semantic-green-700',
  secondary:
    'bg-atmos-700 text-white shadow hover:opacity-90 dark:bg-semantic-green-500',
  danger:
    'bg-semantic-red-500 dark:bg-semantic-red-600 text-white hover:bg-semantic-red-600 dark:hover:bg-semantic-red-700',
  muted:
    'bg-fuselage-50/10 text-fuselage-150 hover:bg-fuselage-50/25 hover:text-fuselage-200 dark:text-fuselage-300 dark:bg-fuselage-700 border border-fuselage-50/50 dark:border-fuselage-600/50 hover:dark:bg-fuselage-600 hover:dark:text-fuselage-200',
};

const baseStyle =
  'flex items-center justify-center text-center gap-1 rounded font-semibold cursor-pointer transition-all disabled:cursor-not-allowed disabled:opacity-50';

export function CustomButton({
  title,
  icon,
  size = 'sm',
  variant = 'muted',
  isFullWidth = false,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={classNames(
        baseStyle,
        sizesVariants[size],
        isFullWidth ? 'w-full' : 'w-fit',
        colorsVariants[variant],
      )}
      {...props}
    >
      {icon}
      <span>{title}</span>
    </button>
  );
}
