import PageHeader from '@/components/PageHeader';
import config from '@/utils/config';
import {fetchEditorialPage} from '@/utils/contentful';
import {getEditorialSeo} from '@/utils/helpers';

const ContactPage = async () => {
    const page = await fetchEditorialPage('contact') || {};

    return (
        <div className="flex flex-grow h-[calc(100vh-110px)] border-spacing-4 py-4 px-3 md:justify-center">
            <div className="flex flex-col space-y-2">
                <PageHeader title={page.pageTitle} description={page.content} />
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
