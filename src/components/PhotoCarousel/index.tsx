'use client';

import {memo, useEffect, useRef, useState} from 'react';
import useKeypress from 'react-use-keypress';
import {useWindowWidth} from '@react-hook/window-size';
import {useRouter, usePathname} from 'next/navigation';
import CarouselDetails from './Details';
import CarouselImage from './Image';
import ImageContainer from './ImageContainer';
import CarouselMobilePagination from './MobilePagination';
import CarouselSwipeNavigation from './SwipeNavigation';

interface Props {
    collection: PhotoCollection;
    photo: string;
}

const PhotoCarousel: React.FC<Props> = ({collection, photo}) => {
    const router = useRouter();
    const pathname = usePathname();
    const isWriting = pathname.startsWith('/writing');
    const basePath = isWriting ? '/writing' : '/projects';
    const $container = useRef<HTMLDivElement>(null);
    const windowWidth = useWindowWidth();
    const [containerWidth, setContainerWidth] = useState<number>(0);

    const allPhotos = collection.photosCollection.items;
    const activeIndex = allPhotos.findIndex(item => item.slug === photo);
    const activePhoto = allPhotos[activeIndex];
    const prevPhoto = allPhotos[activeIndex === 0 ? allPhotos.length - 1 : activeIndex - 1];
    const nextPhoto = allPhotos[activeIndex === allPhotos.length - 1 ? 0 : activeIndex + 1];
    const orientation =
        activePhoto?.fullSize?.width > activePhoto?.fullSize?.height ? 'landscape' : 'portrait';

    const navigateToNextPhoto = (nextDirection: 'left' | 'right') => {
        const {items} = collection.photosCollection;
        let nextPhotoIndex = nextDirection === 'left' ? activeIndex - 1 : activeIndex + 1;

        if (nextPhotoIndex < 0) {
            nextPhotoIndex = items.length - 1;
        } else if (nextPhotoIndex > items.length - 1) {
            nextPhotoIndex = 0;
        }

        router.push(`${basePath}/${collection.slug}/${items[nextPhotoIndex].slug}`);
    };

    useKeypress('ArrowLeft', () => navigateToNextPhoto('left'));
    useKeypress('ArrowRight', () => navigateToNextPhoto('right'));

    useEffect(() => {
        if ($container.current) {
            setContainerWidth($container.current.offsetWidth);
        }
    }, [windowWidth, activeIndex]);

    useEffect(() => {
        // prefetch the next/previous photo
        router.prefetch(`${basePath}/${collection.slug}/${prevPhoto.slug}`);
        router.prefetch(`${basePath}/${collection.slug}/${nextPhoto.slug}`);
    }, [collection, nextPhoto, prevPhoto, router, basePath]);

    return (
        <div
            className="relative min-h-[200px] w-full overflow-hidden md:flex md:h-full md:max-h-[calc(100vh-2rem)] md:flex-col"
            ref={$container}
        >
            <div className="relative flex w-full overflow-hidden md:h-auto md:w-full md:flex-grow">
                <div className="opacity-0">
                    <CarouselImage isActive={false} {...prevPhoto} />
                    <CarouselImage isActive={false} {...nextPhoto} />
                </div>
                <ImageContainer activeIndex={activeIndex} orientation={orientation}>
                    <CarouselImage isActive={true} {...allPhotos[activeIndex]} />
                </ImageContainer>
                <CarouselSwipeNavigation
                    handleNext={() => navigateToNextPhoto('right')}
                    handlePrevious={() => navigateToNextPhoto('left')}
                />
                <button
                    className="tap-transparent absolute left-0 top-0 z-10 hidden h-full w-1/2 cursor-[url(/images/left-arrow.svg)_15_15,_pointer] bg-transparent focus:outline-none md:block"
                    onClick={() => navigateToNextPhoto('left')}
                    type="button"
                />
                <button
                    className="tap-transparent absolute right-0 top-0 z-10 hidden h-full w-1/2 cursor-[url(/images/right-arrow.svg)_15_15,_pointer] bg-transparent focus:outline-none md:block"
                    onClick={() => navigateToNextPhoto('right')}
                    type="button"
                />
            </div>
            <CarouselDetails
                activeIndex={activeIndex}
                activePhoto={activePhoto}
                collection={collection}
                total={allPhotos.length}
            />
            <CarouselMobilePagination
                handleBack={() => router.push(`${basePath}/${collection.slug}#${activePhoto.slug}`)}
                handleNext={() => navigateToNextPhoto('right')}
                handlePrevious={() => navigateToNextPhoto('left')}
            />
        </div>
    );
};

export default memo(PhotoCarousel);