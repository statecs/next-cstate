import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
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

  if (isAuthenticated) {
    const isNewUser = roles.some(role => role.key === 'new-users');

    if (isNewUser && collection.isMembersOnly) {
      redirect('https://www.buymeacoffee.com/cstate');
    }
  }

  const heroImage = collection.photosCollection?.items?.[0];

  return (
    <ScrollArea useScrollAreaId>
      <FloatingHeader scrollTitle="Writing" goBackLink="/writing" />
      <div className="aurora-main">

        {/* Mobile: hero with image as background */}
        {heroImage && (
          <div className="relative sm:hidden h-[55vw] min-h-[240px] max-h-[380px] overflow-hidden">
            <Image
              src={heroImage.fullSize.url}
              alt={heroImage.description || collection.title}
              fill
              className="object-cover"
              priority
              placeholder={heroImage.base64 ? 'blur' : 'empty'}
              blurDataURL={heroImage.base64}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <h1
                className="font-serif leading-[0.88] tracking-[-0.04em] text-white"
                style={{ fontSize: 'clamp(28px, 8vw, 52px)' }}
              >
                {collection.title}
              </h1>
            </div>
          </div>
        )}

        {/* Desktop: editorial header */}
        <div className={heroImage ? 'hidden sm:block' : ''}>
          <div className="px-8 pt-16 pb-12 border-b border-[var(--aurora-line2)]">
            <div className="max-w-6xl mx-auto">
              <div className="aurora-mono hidden sm:flex items-center justify-between mb-10">
                <span>§ 01{' — '}{collection.title}</span>
                {collection.date && <span>{formatDate(collection.date)}</span>}
              </div>
              <h1
                className="font-serif leading-[0.86] tracking-[-0.045em] text-[var(--aurora-text)] mb-6"
                style={{ fontSize: 'clamp(36px, 7vw, 100px)' }}
              >
                {collection.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pt-10">
          <div className="max-w-6xl mx-auto">
            {/* Hide banner on mobile when hero image is shown */}
            <div className={heroImage ? 'hidden sm:block' : ''}>
              <BannerPhotoCollection {...collection} key={collection.slug} />
            </div>
            {/* Metadata Strip */}
            <div className={`border border-[var(--aurora-line)] grid grid-cols-1 divide-y divide-[var(--aurora-line)] mb-8 ${collection.ctaLabel && collection.ctaUrl ? 'sm:grid-cols-4 sm:divide-y-0 sm:divide-x' : 'sm:grid-cols-3 sm:divide-y-0 sm:divide-x'}`}>
              <div className="flex sm:block items-center gap-3 sm:gap-0 px-4 sm:px-6 py-3 sm:py-4">
                <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.1em] text-[var(--aurora-muted)] sm:mb-2 shrink-0">Date Published</p>
                {collection.date && (
                  <p className="font-serif text-[var(--aurora-text)] text-sm sm:text-base">{formatDate(collection.date)}</p>
                )}
              </div>
              <div className="flex sm:block items-center gap-3 sm:gap-0 px-4 sm:px-6 py-3 sm:py-4">
                <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.1em] text-[var(--aurora-muted)] sm:mb-2 shrink-0">Total Read</p>
                {collection.description && (
                  <p className="font-serif text-[var(--aurora-text)] text-sm sm:text-base">
                    {estimateReadTime(collection.description)} min
                  </p>
                )}
              </div>
              <div className="flex sm:block items-center gap-3 sm:gap-0 px-4 sm:px-6 py-3 sm:py-4">
                <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.1em] text-[var(--aurora-muted)] sm:mb-2 shrink-0">Tags</p>
                {collection.category && (
                  <div className="flex flex-wrap gap-1">
                    {collection.category.split(',').map((cat: string) => (
                      <span key={cat.trim()} className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.06em] text-[var(--aurora-muted)] border border-[var(--aurora-line2)] px-2 py-0.5">
                        {cat.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {collection.ctaLabel && collection.ctaUrl && (
                <div className="flex sm:block items-center gap-3 sm:gap-0 px-4 sm:px-6 py-3 sm:py-4">
                  <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.1em] text-[var(--aurora-muted)] sm:mb-2 shrink-0">Link</p>
                  <a
                    href={collection.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.06em] text-[var(--aurora-text)] border border-[var(--aurora-line2)] px-2 py-0.5 hover:bg-[var(--aurora-line2)] transition-colors inline-flex items-center gap-1"
                  >
                    {collection.ctaLabel}
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                      <path d="M1.5 8.5L8.5 1.5M8.5 1.5H3M8.5 1.5V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Article body */}
        <div className={`max-w-3xl mx-auto px-6 pb-12${params.collection === 'home' ? ' md:hidden' : ''}`}>
          <PageHeader
            currentPage="writing"
            title={undefined}
            date={undefined}
            category={undefined}
            description={collection?.showDescription ? collection.description : null}
          />
        </div>
      </div>
    </ScrollArea>
  );
};
