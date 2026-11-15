import { AudioLinesIcon, FileCheckIcon, ScanEyeIcon, ShoppingBasketIcon } from 'lucide-react';
import { type ProductKey } from '@/utils/constants';

const ICON_COMPONENTS: Record<ProductKey, typeof AudioLinesIcon> = {
    notely: AudioLinesIcon,
    altvision: ScanEyeIcon,
    tillsa: ShoppingBasketIcon,
    verifa: FileCheckIcon,
};

/** The app's icon, used by the /projects cards. */
export const ProductIcon: React.FC<{ product: ProductKey; size?: number }> = ({ product, size = 14 }) => {
    const Icon = ICON_COMPONENTS[product];
    return <Icon size={size} strokeWidth={1.6} aria-hidden="true" />;
};
