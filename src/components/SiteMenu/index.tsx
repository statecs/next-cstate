import SiteMenuLink from '@/components/SiteMenu/Link';
import {fetchCollectionNavigation} from '@/utils/contentful';

const SiteMenu: React.FC = async () => {
    const links = await fetchCollectionNavigation();

    return (
        <nav className="mb-16 space-y-0.5 py-8 sm:space-y-0 md:sticky md:top-16 md:py-0">
            {links?.map(link => (
                <SiteMenuLink key={link.url} {...link} />
            ))}
            <div>
                <div className="mt-2 max-w-[160px] border-t-2 border-gray-200 pt-2 dark:border-gray-800">
                    <SiteMenuLink title="All collections" url="/collections" />
                </div>
            </div>
        </nav>
    );
};

export default SiteMenu;
