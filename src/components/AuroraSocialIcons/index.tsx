import { GithubIcon, LinkedinIcon } from 'lucide-react';
import { SOCIAL_LINKS } from '@/utils/constants';

const XIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
    </svg>
);

const ICONS = {
    linkedin: <LinkedinIcon size={15} strokeWidth={1.6} />,
    github: <GithubIcon size={15} strokeWidth={1.6} />,
    x: <XIcon />,
};

/** Round icon links to the profiles in SOCIAL_LINKS. */
const AuroraSocialIcons: React.FC<{ className?: string }> = ({ className }) => (
    <ul className={className ? `aurora-social ${className}` : 'aurora-social'} aria-label="Elsewhere">
        {SOCIAL_LINKS.map(s => (
            <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label}>
                    {ICONS[s.key]}
                </a>
            </li>
        ))}
    </ul>
);

export default AuroraSocialIcons;
