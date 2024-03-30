interface Props {
    activeIndex: number;
    total: number;
}

const CarouselCounter: React.FC<Props> = ({activeIndex, total}) => (
    <div className="flex items-center space-x-1 font-serif text-xs text-black sm:text-sm dark:text-white">
        <span className="inline-block">{activeIndex + 1}</span>
        <span className=" font-sans text-xs text-gray-600 dark:text-gray-400">/</span>
        <span className="inline-block">{total}</span>
    </div>
);

export default CarouselCounter;
