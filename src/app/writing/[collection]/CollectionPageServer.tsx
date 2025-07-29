import { notFound, redirect } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import BannerPhotoCollection from '@/components/BannerPhotoCollection';
import { ScrollArea } from '@/components/SideMenu/ScrollArea';
import { FloatingHeader } from '@/components/ListLayout/FloatingHeader';

interface Props {
  params: { collection: string };
  collection: any;
  isAuthenticated: boolean;
  roles: any[];
}

export const CollectionPageServer: React.FC<Props> = ({ 
  params, 
  collection, 
  isAuthenticated, 
  roles
}) => {
  if (!collection) return notFound();

  if (!collection.isPublic && !isAuthenticated) {
    const baseUrl = process.env.NEXT_PUBLIC_URL;
    
    if (!baseUrl) {
      throw new Error('NEXT_PUBLIC_URL is not set in the environment');
    }

    redirect(`${baseUrl}/api/auth/login?post_login_redirect_url=${baseUrl}/writing/${params.collection}`);
  }

  // Check if the user is authenticated and has the 'new-users' role
  if (isAuthenticated) {
    const isNewUser = roles.some(role => role.key === 'new-users');

    if (isNewUser && collection.isMembersOnly) {
      redirect('https://www.buymeacoffee.com/cstate');
    }
  }

  return (
    <ScrollArea useScrollAreaId>
      <FloatingHeader scrollTitle="Writing" goBackLink="/writing" />
      <div className="flex flex-grow py-8 px-4 sm:px-8 md:justify-center">
        <div className="flex flex-col space-y-8 w-full">
          <div className="max-w-5xl mx-auto w-full">
            {/* Banner Photo Collection */}
            <BannerPhotoCollection {...collection} key={collection.slug} />
            
            {/* Page Header below banner */}
            <div className={params.collection === 'home' ? 'md:hidden' : ''}>
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
                <PageHeader
                  currentPage="writing"
                  {...collection}
                  description={collection?.showDescription ? collection.description : null}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};