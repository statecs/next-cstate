import { AudioLinesIcon, FileCheckIcon, ScanEyeIcon, ShoppingBasketIcon } from 'lucide-react';
import { PRODUCT_LINKS, type ProductKey } from '@/utils/constants';
import ComingSoonPill from './ComingSoonPill';

const ICON_COMPONENTS: Record<ProductKey, typeof AudioLinesIcon> = {
    notely: AudioLinesIcon,
    altvision: ScanEyeIcon,
    tillsa: ShoppingBasketIcon,
    verifa: FileCheckIcon,
};

/** The app's icon, shared by the home page pills and the /projects cards. */
export const ProductIcon: React.FC<{ product: ProductKey; size?: number }> = ({ product, size = 14 }) => {
    const Icon = ICON_COMPONENTS[product];
    return <Icon size={size} strokeWidth={1.6} aria-hidden="true" />;
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
                        <ProductIcon product={p.key} />
                    </ComingSoonPill>
                ) : (
                    <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${p.label} — ${p.blurb} (opens in a new tab)`}
                        title={`${p.label} — ${p.blurb}`}
                    >
                        <ProductIcon product={p.key} />
                        <span>{p.host}</span>
                    </a>
                )}
            </li>
        ))}
    </ul>
);

export default AuroraProductLinks;
