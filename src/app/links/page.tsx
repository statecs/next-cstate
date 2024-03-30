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
        <>
            <PageHeader title="Links" />
            <LinksList links={links} />
        </>
    );
};

export const generateMetadata = async () => {
    return { ...config.seo, ...getEditorialSeo({ slug: 'links', title: 'Links' }) };
};

export const revalidate = 60;

export default LinksPage;
