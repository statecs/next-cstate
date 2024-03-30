import Image from 'next/image';
import PageHeader from '@/components/PageHeader';
import config from '@/utils/config';
import {fetchEditorialPage} from '@/utils/contentful';
import {getEditorialSeo} from '@/utils/helpers';

const AboutPage = async () => {
    const page = await fetchEditorialPage('about') || {};

    return (
        <div className="grid w-full max-w-[700px] gap-4 lg:grid-cols-4 lg:gap-10">
            <div className="lg:col-span-3">
                <PageHeader description={page.content} title={page.pageTitle} />
            </div>
            <Image
                alt=""
                className="max-w-full sm:max-w-[260px] lg:mt-20"
                height={page.photo?.height}
                placeholder="empty"
                priority={false}
                quality={90}
                src={page.photo?.url}
                width={page.photo?.width}
            />
        </div>
    );
};

export const generateMetadata = async () => {
    const page = await fetchEditorialPage('about') || {};
    return {...config.seo, ...getEditorialSeo(page)};
};

export const revalidate = 60;

export default AboutPage;
