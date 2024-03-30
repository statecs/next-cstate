import clsx from 'clsx';
import {SpinnerIcon} from '@/components/Icon';

interface Props {
    hasLoaded: boolean;
    isActive: boolean;
}

const CarouselSpinner: React.FC<Props> = ({hasLoaded, isActive}) => (
    <div
        className={clsx(
            'absolute size-full origin-center -translate-x-3 -translate-y-3 transition duration-200',
            {'opacity-1': isActive && !hasLoaded, 'opacity-0': hasLoaded}
        )}
    >
        <div className="absolute left-1/2 top-1/2 size-6 animate-spin">
            <SpinnerIcon className="size-6 text-black dark:text-white" />
        </div>
    </div>
);

export default CarouselSpinner;
