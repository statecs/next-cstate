import SiteMenuLink from '@/components/SiteMenu/Link';

const SiteMenu: React.FC = async () => {

    return (
        <nav className="mb-16 space-y-0.5 py-8 sm:space-y-0 md:sticky md:top-16 md:py-0">
            <div>
                <div className="mt-2 max-w-[160px] border-t border-gray-200 pt-2 dark:border-zinc-700">
                    <SiteMenuLink title="All collections" url="/collections" />
                </div>
            </div>
        </nav>
    );
};

export default SiteMenu;
