import Image from 'next/image';
import PageHeader from '@/components/PageHeader';
import config from '@/utils/config';
import {fetchEditorialPage} from '@/utils/contentful';
import {getEditorialSeo} from '@/utils/helpers';

const AboutPage = async () => {
    const page = await fetchEditorialPage('home') || {};

    return (
        <div className="grid w-full max-w-[700px] gap-4 lg:grid-cols-4 lg:gap-10">
            <div className="lg:col-span-3">
                <PageHeader description={page.content} title={page.pageTitle} />
            </div>
        </div>
    );
};

export const generateMetadata = async () => {
    const page = await fetchEditorialPage('home') || {};
    return {...config.seo, ...getEditorialSeo(page)};
};

export const revalidate = 60;

export default AboutPage;
