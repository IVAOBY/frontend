import { ReactNode, useState } from 'react';

import { classNames } from '../../utils/styles';

type TooltipPositions = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: TooltipPositions;
}

const baseStyle = 'relative inline-block cursor-pointer transition-all';

const tooltipStyles: { [key in TooltipPositions]: string } = {
  top: 'tooltip-top absolute -left-1/2 transform -translate-x-1/2 -bottom-full',
  bottom:
    'tooltip-bottom absolute left-1/2 transform -translate-x-1/2 top-full',
  left: 'tooltip-left absolute -top-1/2 transform -translate-y-1/2 -right-full',
  right: 'tooltip-right absolute -top-1/2 transform -translate-y-1/2 left-full',
};

export function Tooltip({ children, content, position = 'top' }: TooltipProps) {
  const [isTooltipVisible, setTooltipVisible] = useState(false);

  return (
    <div className={classNames(baseStyle)}>
      <div
        className={classNames('relative')}
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
      >
        {children}
      </div>
      {isTooltipVisible && (
        <div
          className={classNames(
            'tooltip',
            tooltipStyles[position],
            'transition-opacity',
          )}
        >
          <div className="tooltip-content min-w-[200px] rounded rounded-2xl bg-black px-2 py-1 text-sm text-white opacity-100">
            {content}
          </div>
        </div>
      )}
    </div>
  );
}
