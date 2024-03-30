import SocialLinks from '@/components/SiteMenu/SocialLinks';
import UnderlineLink from '@/components/UnderlineLink';

export const LINKS = [
    {label: 'About', url: '/about'},
    {label: 'Contact', url: '/contact'},
    {label: 'Links', url: '/links'}
];

const SiteFooter: React.FC = () => (
    <nav className="relative z-50 flex items-end space-x-3 border-t-2 border-transparent bg-white pb-4 dark:bg-black">
        {LINKS.map(link => (
            <UnderlineLink href={link.url} key={link.url} className="text-sm">
                {link.label}
            </UnderlineLink>
        ))}
        <SocialLinks />
    </nav>
);

export default SiteFooter;
