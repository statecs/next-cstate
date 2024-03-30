import Button from '../Button';
import {LeftArrowIcon, RightArrowIcon} from '@/components/Icon';

interface Props {
    handleBack: () => void;
    handleNext: () => void;
    handlePrevious: () => void;
}

const CarouselMobilePagination: React.FC<Props> = ({handleBack, handleNext, handlePrevious}) => (
    <div className="relative z-50 mt-2 flex items-center justify-end space-x-2 md:hidden">
        <Button className="flex-grow" onClick={handlePrevious} rel="prev">
            Prev
        </Button>
        <Button className="px-8" onClick={handleBack} rel="next">
            Back
        </Button>
        <Button className="flex-grow" onClick={handleNext} rel="next">
            Next
        </Button>
    </div>
);

export default CarouselMobilePagination;
