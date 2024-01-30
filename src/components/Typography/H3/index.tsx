import { ComponentPropsWithoutRef, forwardRef } from 'react';

import { classNames } from '../../../utils/styles';

export const H3 = forwardRef<
  HTMLHeadingElement,
  ComponentPropsWithoutRef<'h3'>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={classNames('scroll-m-20 text-2xl font-semibold', className)}
    {...props}
  />
));
H3.displayName = 'H3';
