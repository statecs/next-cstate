'use client';

import {useSwipeable} from 'react-swipeable';

interface Props {
    handleNext: () => void;
    handlePrevious: () => void;
}

const CarouselSwipeNavigation: React.FC<Props> = ({handleNext, handlePrevious}) => {
    const handlers = useSwipeable({
        preventScrollOnSwipe: true,
        onSwipedLeft: handleNext,
        onSwipedRight: handlePrevious
    });

    return <div className="absolute top-0 left-0 right-0 bottom-0 md:hidden" {...handlers} />;
};

export default CarouselSwipeNavigation;
