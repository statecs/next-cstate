import { Drawer, DrawerContent, DrawerTrigger } from './Drawer';
import { MenuContent } from '@/components/SideMenu'
import { drawerAtom } from '@/utils/store';
import { useAtom } from 'jotai';
import { AlignRightIcon } from 'lucide-react'
import SiteMenu from '../SiteMenu';

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
          aria-label="Menu"
          className="relative z-50 size-6 translate-y-[-2px] lg:hidden"
          onClick={handleButtonClick} // Set isOpen to true on click
        >
          <AlignRightIcon size={24} />
        </button>
      </DrawerTrigger>
      <DrawerContent className="h-[70%]">
        <div className="overflow-y-auto p-4">
          <MenuContent />
          <SiteMenu />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
