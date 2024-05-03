import { ButtonHTMLAttributes, forwardRef } from 'react';

import { VariantProps } from 'class-variance-authority';

import { buttonVariants } from './buttonVariants';

import { classNames } from '../../utils/styles';

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {}

export const CustomButton = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
      // TODO: if is loading, insert a spinner
      return (
          <button
              className={classNames(buttonVariants({ variant, size }), className)}
              ref={ref}
              {...props}
          />
      );
    },
);
CustomButton.displayName = 'Button';