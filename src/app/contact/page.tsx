import PageHeader from '@/components/PageHeader';
import config from '@/utils/config';
import {fetchEditorialPage} from '@/utils/contentful';
import {getEditorialSeo} from '@/utils/helpers';

const ContactPage = async () => {
    const page = await fetchEditorialPage('contact') || {};

    return (
        <div className="max-w-[700px]">
            <PageHeader title={page.pageTitle} description={page.content} />
        </div>
    );
};

export const generateMetadata = async () => {
    const page = await fetchEditorialPage('contact') || {};
    return {...config.seo, ...getEditorialSeo(page)};
};

export const revalidate = 60;

export default ContactPage;
