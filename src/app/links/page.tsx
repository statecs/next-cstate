import LinksList from '@/components/LinksList';
import PageHeader from '@/components/PageHeader';
import config from '@/utils/config';
import { fetchLinksPage } from '@/utils/contentful';
import { getEditorialSeo } from '@/utils/helpers';

const LinksPage = async () => {
    const page = await fetchLinksPage() || {};

    // Ensuring page.linksCollection has a default value if it's nullish
    const links = page.linksCollection?.items || [];

    return (
        <div className="flex flex-grow border-spacing-4 py-4 px-3 md:justify-center">
            <div className="flex flex-col space-y-2">
                <PageHeader title="Links" />
                <LinksList links={links} />
            </div>
        </div>
    );
};

export const generateMetadata = async () => {
    return { ...config.seo, ...getEditorialSeo({ slug: 'links', title: 'Links' }) };
};

export const revalidate = 60;

export default LinksPage;
