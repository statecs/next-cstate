import { Drawer, DrawerContent, DrawerTrigger } from './Drawer'
import { MenuIcon } from '@/components/Icon';

interface Props {
    className?: string;
}

export const MobileDrawer: React.FC<Props> = () => (

    <Drawer>
    <DrawerTrigger asChild>
      <button type="button" className="relative z-50 size-6 translate-y-[-2px] md:hidden">
        <MenuIcon className="h-auto w-6 text-black dark:text-white" />
      </button>
    </DrawerTrigger>
    <DrawerContent className="h-[80%]">
      <div className="overflow-y-auto p-4">
        <h1>Drawer content</h1>
      </div>
    </DrawerContent>
  </Drawer>
);