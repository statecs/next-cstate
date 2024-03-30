import Link from 'next/link';
import CarouselCounter from './Counter';
import PhotoExternalLink from './ExternalLink';
import PhotoSocialLinks from './SocialLinks';

interface Props {
    activeIndex: number;
    activePhoto: Photo;
    collection: PhotoCollection;
    total: number;
}

const CarouselDetails: React.FC<Props> = ({activeIndex, activePhoto, collection, total}) => (
    <footer className="relative z-50 mt-4 flex items-end justify-between md:min-h-[44px] md:border-t-2 md:border-gray-200 dark:border-gray-800">
        <div className="flex items-center">
            <div className="space-y-2 text-gray-600 md:flex md:items-baseline md:space-x-2 dark:text-gray-300">
                {activePhoto?.title && (
                    <span className="block break-normal text-sm sm:text-base">
                        {activePhoto.title}
                    </span>
                )}
            </div>
            {/* {activePhoto?.description && (
                    <p className="mt-2 text-sm tracking-wide text-gray-400 dark:text-gray-600">
                        {activePhoto.description}
                    </p>
                )} */}
            {/* <PhotoSocialLinks photo={activePhoto} />
            <PhotoExternalLink photo={activePhoto} /> */}
        </div>
        <CarouselCounter activeIndex={activeIndex} total={total} />
    </footer>
);

export default CarouselDetails;
