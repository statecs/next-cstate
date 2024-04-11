'use client';

import { useEffect, useState } from "react";
import { Drawer, DrawerContent, DrawerHeader } from './Drawer';
import { drawerScrollAtom } from '@/utils/store';
import { useAtom } from 'jotai';

const ScrollDrawer = () => {
  const [isOpen, setIsOpen] = useAtom(drawerScrollAtom);
  const [content, setContent] = useState<ContentState | null>(null);

  useEffect(() => {
    setIsOpen(true);
    const fetchData = async () => {
      const response = await fetch('/api/journey');
      const data = await response.json();
      // Ensure that the data has the correct structure
      if (data && data.allCollections) {
        setContent({ allCollections: data.allCollections, page: data.page });
      }
    };
    
    fetchData();
    
  }, [setIsOpen]);

  return (
    <Drawer snapPoints={["200px", "355px", 1]}
     dismissible={true} open={isOpen} closeThreshold={0} modal={false} shouldScaleBackground={false} onOpenChange={setIsOpen}>
      <DrawerContent className="h-[80%]">
        <DrawerHeader id="title">About me</DrawerHeader>
        <div className="overflow-y-auto p-4">
        <div>
        {content && content.page && content.page.content && content.page.content.json.content.map((block: BlockNode, index: number) => {
          if (block.nodeType === 'paragraph') {
            return (
              <p key={index}>
                {block.content.map((text: TextNode, textIndex: number) => {
                  if (text.nodeType === 'text') {
                    return <span key={textIndex}>{text.value}</span>;
                  }
                  return null;
                })}
              </p>
            );
          }
          return null;
        })}

        </div>

        {content && content.allCollections.map((collection, index) => (
          <div key={index}>
            <h2>{new Date(collection.sys.published).getFullYear()}</h2>
            <p>{collection.title}</p>
            <p>{collection.description}</p>
            {collection.imageCollection.items.map((image, idx) => (
              <div key={idx}>
                <img src={image.url} alt={image.description} />
                <p>{image.description}</p>
              </div>
            ))}
          </div>
        ))}

        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ScrollDrawer;
