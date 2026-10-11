import { AudioLinesIcon, FileCheckIcon, ScanEyeIcon, ShoppingBasketIcon } from 'lucide-react';
import { PRODUCT_LINKS, type ProductKey } from '@/utils/constants';
import ComingSoonPill from './ComingSoonPill';

const ICONS: Record<ProductKey, JSX.Element> = {
    notely: <AudioLinesIcon size={14} strokeWidth={1.6} aria-hidden="true" />,
    altvision: <ScanEyeIcon size={14} strokeWidth={1.6} aria-hidden="true" />,
    tillsa: <ShoppingBasketIcon size={14} strokeWidth={1.6} aria-hidden="true" />,
    verifa: <FileCheckIcon size={14} strokeWidth={1.6} aria-hidden="true" />,
};

/**
 * Small icon + domain pills to the apps in PRODUCT_LINKS, each opening in a new
 * tab. An app flagged comingSoon is shown but not linked.
 */
const AuroraProductLinks: React.FC<{ className?: string }> = ({ className }) => (
    <ul className={className ? `aurora-products ${className}` : 'aurora-products'} aria-label="Apps I've built">
        {PRODUCT_LINKS.map(p => (
            <li key={p.key}>
                {p.comingSoon ? (
                    <ComingSoonPill label={p.label} host={p.host}>
                        {ICONS[p.key]}
                    </ComingSoonPill>
                ) : (
                    <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${p.label} — ${p.blurb} (opens in a new tab)`}
                        title={`${p.label} — ${p.blurb}`}
                    >
                        {ICONS[p.key]}
                        <span>{p.host}</span>
                    </a>
                )}
            </li>
        ))}
    </ul>
);

export default AuroraProductLinks;
