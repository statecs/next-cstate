'use client';

import { useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader } from './Drawer';
import { drawerScrollAtom } from '@/utils/store';
import { useAtom } from 'jotai';

const ScrollDrawer = () => {
 const [isOpen, setIsOpen] = useAtom(drawerScrollAtom);

  useEffect(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  return (

    <Drawer snapPoints={["200px", "355px", 1]}
     dismissible={true} open={isOpen} closeThreshold={0} modal={false} shouldScaleBackground={false} onOpenChange={setIsOpen}>

        <DrawerContent className="h-[80%]">
        <DrawerHeader>About me</DrawerHeader>
        
        <div className="overflow-y-auto p-4">
          {/* Content */ }
          
        </div>
        </DrawerContent>
    </Drawer>

  );
};

export default ScrollDrawer;
