import { Drawer, DrawerContent, DrawerTrigger } from './Drawer';
import { MenuIcon } from '@/components/Icon';
import SiteFooter from '@/components/SiteFooter';
import { MenuContent } from '@/components/SideMenu'
import { drawerAtom } from '@/utils/store';
import { useAtom } from 'jotai';

interface Props {
  className?: string;
}

export const MobileDrawer: React.FC<Props> = () => {
  const [isOpen, setIsOpen] = useAtom(drawerAtom);

  // Handle button click to set isOpen to true
  const handleButtonClick = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <button 
          type="button" 
          className="relative z-50 size-6 translate-y-[-2px] lg:hidden"
          onClick={handleButtonClick} // Set isOpen to true on click
        >
          <MenuIcon className="h-auto w-6 text-black dark:text-white" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="h-[80%]">
        <div className="overflow-y-auto p-4">
          <MenuContent />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
