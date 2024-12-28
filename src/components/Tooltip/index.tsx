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
  top: 'absolute left-1/2 transform -translate-x-1/2 -translate-y-[75px]',
  bottom: 'absolute left-1/2 transform -translate-x-1/2 translate-y-[5px]',
  left: 'absolute top-1/2 transform -translate-y-1/2 -translate-x-[205px]',
  right: 'absolute top-1/2 transform -translate-y-1/2 translate-x-[160px]',
};

export function Tooltip({ children, content, position = 'top' }: TooltipProps) {
  const [isTooltipVisible, setTooltipVisible] = useState(false);

  return (
    <div className={classNames(baseStyle)}>
      <div
        className="relative"
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
      >
        {children}
      </div>
      {isTooltipVisible && (
        <div
          className={classNames(
            tooltipStyles[position],
            'z-10 min-w-[200px] rounded-lg bg-black px-3 py-2 text-white font-semibold text-sm shadow-xl transition-opacity opacity-100',
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}
