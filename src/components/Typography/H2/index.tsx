import { ComponentPropsWithoutRef, forwardRef } from 'react';

import { classNames } from '../../../utils/styles';

export const H2 = forwardRef<
  HTMLHeadingElement,
  ComponentPropsWithoutRef<'h2'>
>(({ className, children, ...props }, ref) => (
  <h2
    ref={ref}
    className={classNames(
      'mt-10 scroll-m-20 border-b border-fuselage-50 pb-3 text-3xl font-bold transition-colors first:mt-0',
      className,
    )}
    {...props}
  >
    {children}
  </h2>
));
H2.displayName = 'H2';
