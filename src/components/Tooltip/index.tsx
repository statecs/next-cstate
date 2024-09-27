import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  delay?: number;
  position?: 'right' | 'top' | 'bottom' | 'left';
  maxWidth?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, delay = 100, position = 'right', maxWidth = '200px' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLElement>(null);
  let timeoutId: NodeJS.Timeout;

  const showTooltip = () => {
    timeoutId = setTimeout(() => setIsVisible(true), delay);
  };

  const hideTooltip = () => {
    clearTimeout(timeoutId);
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible && tooltipRef.current && targetRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      let top = 0;
      let left = 0;

      switch (position) {
        case 'right':
          top = targetRect.top + window.scrollY + (targetRect.height / 2) - (tooltipRect.height / 2);
          left = targetRect.right + window.scrollX + 10;
          break;
        case 'left':
          top = targetRect.top + window.scrollY + (targetRect.height / 2) - (tooltipRect.height / 2);
          left = targetRect.left + window.scrollX - tooltipRect.width - 10;
          break;
        case 'top':
          top = targetRect.top + window.scrollY - tooltipRect.height - 10;
          left = targetRect.left + window.scrollX + (targetRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'bottom':
        default:
          top = targetRect.bottom + window.scrollY + 10;
          left = targetRect.left + window.scrollX + (targetRect.width / 2) - (tooltipRect.width / 2);
          break;
      }

      // Adjust for viewport boundaries
      if (left < 0) left = 0;
      if (left + tooltipRect.width > window.innerWidth) {
        left = window.innerWidth - tooltipRect.width;
      }
      if (top < 0) top = 0;
      if (top + tooltipRect.height > window.innerHeight) {
        top = window.innerHeight - tooltipRect.height;
      }

      setTooltipPosition({ top, left });
    }
  }, [isVisible, position]);

  const child = React.Children.only(children);

  return (
    <>
      {React.cloneElement(child, {
        ref: targetRef,
        onMouseEnter: showTooltip,
        onMouseLeave: hideTooltip,
      })}
      {isVisible && ReactDOM.createPortal(
        <div
          ref={tooltipRef}
          className="fixed z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm transition-opacity duration-300"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            maxWidth: maxWidth,
          }}
          role="tooltip"
        >
          {content}
        </div>,
        document.body
      )}
    </>
  );
};