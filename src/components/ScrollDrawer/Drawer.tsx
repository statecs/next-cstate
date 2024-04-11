'use client';

import { forwardRef } from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';
import { cn } from '@/utils/helpers';
import { XIcon } from 'lucide-react';


interface DrawerProps {
  shouldScaleBackground?: boolean;
  [key: string]: any;
}

const Drawer = ({ shouldScaleBackground = true, ...props }: DrawerProps) => (
  <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
);
Drawer.displayName = 'Drawer';

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

interface DrawerOverlayProps {
  className?: string;
  [key: string]: any;
}

const DrawerOverlay = forwardRef<HTMLDivElement, DrawerOverlayProps>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay ref={ref} className={cn('fixed inset-0 z-50 bg-black/10 dark:bg-black/80', className)} {...props} />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

interface DrawerContentProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] bg-white dark:bg-custom-light-gray dark:text-white lg:hidden',
        className
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] shrink-0 rounded-full bg-gray-100" />
      {children}
      <DrawerPrimitive.Close className="rounded-full p-2 bg-zinc-50 dark:bg-custom-dark-gray absolute right-5 top-5 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900 dark:data-[state=open]:bg-gray-800">
        <XIcon size={16} aria-label="Close" />
      </DrawerPrimitive.Close>

    </DrawerPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = 'DrawerContent';

interface DrawerHeaderProps {
  className?: string;
  [key: string]: any;
}

const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('grid gap-1.5 px-4 font-serif text-left ', className)} {...props} />
));
DrawerHeader.displayName = 'DrawerHeader';

interface DrawerFooterProps {
  className?: string;
  [key: string]: any;
}

const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />
));
DrawerFooter.displayName = 'DrawerFooter';

interface DrawerTitleProps {
  className?: string;
  [key: string]: any;
}

const DrawerTitle = forwardRef<HTMLDivElement, DrawerTitleProps>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

interface DrawerDescriptionProps {
  className?: string;
  [key: string]: any;
}

const DrawerDescription = forwardRef<HTMLDivElement, DrawerDescriptionProps>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description ref={ref} className={cn('text-sm text-gray-500', className)} {...props} />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;
export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
