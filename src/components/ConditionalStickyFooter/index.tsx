'use client';

import { useAtom } from 'jotai';
import { footerVisibilityAtom } from '@/utils/store';
import SiteFooter from '@/components/SiteFooter';

const ConditionalStickyFooter: React.FC = () => {
  const [isFooterVisible] = useAtom(footerVisibilityAtom);

  if (!isFooterVisible) {
    return null;
  }

  return (
    <div className="lg:hidden sticky bottom-0 w-full lg:relative lg:w-auto shadow-lg before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-t before:from-gray-100 before:to-transparent dark:before:from-custom-dark-gray dark:before:to-transparent">
      <SiteFooter />
    </div>
  );
};

export default ConditionalStickyFooter;
