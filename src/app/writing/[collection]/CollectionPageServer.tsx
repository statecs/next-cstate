import { notFound, redirect } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import BannerPhotoCollection from '@/components/BannerPhotoCollection';
import { ScrollArea } from '@/components/SideMenu/ScrollArea';
import { FloatingHeader } from '@/components/ListLayout/FloatingHeader';

const formatDate = (date: string) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' });
};

const estimateReadTime = (description: any): number => {
  if (!description) return 0;
  const content = typeof description === 'string' ? description : JSON.stringify(description?.json);
  if (!content) return 0;
  return Math.ceil(content.trim().split(/\s+/).length / 200);
};

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
      <div className="bg-[#F4F1EA] dark:bg-zinc-950">
        {/* Editorial Header */}
        <div className="px-8 pt-16 pb-12 border-b border-zinc-900 dark:border-zinc-700">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-10 font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-400">
              <span><span className="text-red-600 dark:text-red-500">§ 01</span>{' — '}{collection.title}</span>
              {collection.date && <span>{formatDate(collection.date)}</span>}
            </div>
            <h1
              className="font-serif leading-[0.86] tracking-[-0.045em] text-zinc-900 dark:text-zinc-50 mb-6"
              style={{ fontSize: 'clamp(36px, 7vw, 100px)' }}
            >
              {collection.title}
            </h1>
          </div>
        </div>
        {/* Content */}
        <div className="px-8 py-10">
          <div className="max-w-6xl mx-auto">
            <BannerPhotoCollection {...collection} key={collection.slug} />
            {/* Metadata Strip */}
            <div className="border border-zinc-200 dark:border-zinc-800 grid grid-cols-3 divide-x divide-zinc-200 dark:divide-zinc-800 mb-8">
              <div className="px-6 py-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-500 mb-2">Date Published</p>
                {collection.date && (
                  <p className="font-serif text-zinc-900 dark:text-zinc-100 text-base">{formatDate(collection.date)}</p>
                )}
              </div>
              <div className="px-6 py-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-500 mb-2">Total Read</p>
                {collection.description && (
                  <p className="font-serif text-zinc-900 dark:text-zinc-100 text-base">
                    {estimateReadTime(collection.description)} min
                  </p>
                )}
              </div>
              <div className="px-6 py-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-500 mb-2">Tags</p>
                {collection.category && (
                  <div className="flex flex-wrap gap-1">
                    {collection.category.split(',').map((cat: string) => (
                      <span key={cat.trim()} className="font-mono text-[10px] uppercase tracking-[0.06em] text-zinc-600 dark:text-zinc-400 border border-zinc-400/50 dark:border-zinc-600 px-2 py-0.5">
                        {cat.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className={params.collection === 'home' ? 'md:hidden' : ''}>
              <PageHeader
                currentPage="writing"
                title={undefined}
                date={undefined}
                category={undefined}
                ctaLabel={collection.ctaLabel}
                ctaUrl={collection.ctaUrl}
                description={collection?.showDescription ? collection.description : null}
              />
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};