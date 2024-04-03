import { cn } from '@/utils/helpers';
import { SCROLL_AREA_ID } from '@/utils/constants';

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  useScrollAreaId?: boolean;
  className?: string;
}

export const ScrollArea: React.FC<ScrollAreaProps> = ({ useScrollAreaId = false, className, ...rest }) => (
  <div
    {...(useScrollAreaId && { id: SCROLL_AREA_ID })}
    className={cn('scrollable-area relative flex w-full flex-col', className)}
    {...rest}
  />
);
