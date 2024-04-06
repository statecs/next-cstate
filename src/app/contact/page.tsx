import PageHeader from '@/components/PageHeader';
import Image from 'next/image';
import Link from 'next/link';
import config from '@/utils/config';
import {fetchEditorialPage} from '@/utils/contentful';
import {getEditorialSeo} from '@/utils/helpers';

const ContactPage = async () => {
    const page = await fetchEditorialPage('contact') || {};

    return (
        <div className="flex flex-grow h-[calc(100vh-110px)] border-spacing-4 py-4 px-8 md:justify-center">
        <div className="flex flex-col space-y-2">
            <div className="grid w-full max-w-[700px] gap-4 lg:grid-cols-4 lg:gap-10">
                <div className="lg:col-span-3">
                    <PageHeader description={page.content} title={page.title} />
                    <h1 className="text-xl font-serif dark:text-white">
                        {page.ctaUrl && 
                            <Link href={page.ctaUrl} title={page.ctaLabel}>
                                {page.ctaLabel}
                            </Link>
                        }
                    </h1>
                </div>
               
                <Image
                    alt={page.photo?.description}
                    className="max-w-full sm:max-w-[260px] lg:mt-20"
                    height={page.photo?.height}
                    placeholder="empty"
                    priority={false}
                    quality={90}
                    src={page.photo?.url}
                    width={page.photo?.width}
                />
            </div>
        </div>
    </div>


      
    );
};

export const generateMetadata = async () => {
    const page = await fetchEditorialPage('contact') || {};
    return {...config.seo, ...getEditorialSeo(page)};
};

export const revalidate = 60;

export default ContactPage;
