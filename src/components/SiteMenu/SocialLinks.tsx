import {InstagramIcon, TwitterIcon, LinkedInIcon, GithubIcon} from '@/components/Icon';

const LINKS = [
    {label: 'Github', url: 'https://github.com/statecs'},
    {label: 'LinkedIn', url: 'https://linkedin.com/in/state'},
    {label: 'Instagram', url: 'https://www.instagram.com/cstate'},
    {label: 'Twitter', url: 'https://twitter.com/statecs'}

];
const ICONS: {[key: string]: any} = {
    instagram: InstagramIcon,
    twitter: TwitterIcon,
    linkedin: LinkedInIcon,
    github: GithubIcon
};

const SiteMenuSocialLinks: React.FC = () => (
    <div className="flex items-center space-x-4 md:justify-center">
        {LINKS.map(link => {
            const Icon = ICONS[link.label.toLowerCase()];

            return (
                <a
                    key={link.url}
                    aria-label={link.label}
                    href={link.url}
                    className="font-serif text-xl tracking-tight text-black duration-200 ease-out hover:opacity-60 focus:outline-dotted focus:outline-2 focus:outline-offset-2 focus:outline-black md:text-xl lg:text-2xl dark:text-white dark:focus:outline-white"
                    rel="noreferrer"
                    target="_blank"
                >
                    <Icon className="size-5 text-current" />
                </a>
            );
        })}
    </div>
);

export default SiteMenuSocialLinks;
