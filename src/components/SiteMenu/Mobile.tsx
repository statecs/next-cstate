import {fetchCollectionNavigation} from '@/utils/contentful';
import MobileClient from './MobileClient';

const SiteMenuMobile: React.FC = async () => {
    const links = await fetchCollectionNavigation();

    return <MobileClient links={links} />;
};

export default SiteMenuMobile;
