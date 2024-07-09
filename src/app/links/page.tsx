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
        <div className="flex flex-grow h-[calc(100vh-110px)] overflow-hidden">
        <div className="w-full overflow-y-auto">
          <div className="flex justify-center pr-4">
            <div className="flex flex-col space-y-2 max-w-[700px] py-4 px-8">
              <PageHeader title="Links" />
              <LinksList links={links} />
            </div>
          </div>
        </div>
      </div>
    );
};

export const generateMetadata = async () => {
    return { ...config.seo, ...getEditorialSeo({ slug: 'links', title: 'Links' }) };
};

export const revalidate = 60;

export default LinksPage;
