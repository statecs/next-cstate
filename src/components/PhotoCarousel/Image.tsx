import clsx from 'clsx';
import Image from 'next/image';

interface Props extends Photo {
    isActive: boolean;
}

const CarouselImage: React.FC<Props> = ({base64, fullSize, isActive, title}) => {
    if (!fullSize) return null;

    return (
        <Image
            alt={fullSize.description || title}
            blurDataURL={base64 || ''}
            className={clsx(
                'w-full animate-fadeIn transition ease-in-out md:absolute md:block md:h-full md:flex-shrink-0 md:object-contain md:object-center',
                {'absolute opacity-0 lg:block': !isActive, 'relative block opacity-100': isActive}
            )}
            height={fullSize.height}
            placeholder={base64 ? 'blur' : 'empty'}
            quality={75}
            sizes="(max-width: 1024px) 100vw, 90vw"
            src={fullSize.url}
            width={fullSize.width}
        />
    );
};

export default CarouselImage;
