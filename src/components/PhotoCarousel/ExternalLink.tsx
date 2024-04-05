import Link from 'next/link';
import {getExternalUrl} from '@/utils/helpers';

interface Props {
    photo: Photo;
}

const CarouselExternalLink: React.FC<Props> = ({photo}) => {
    if (!photo?.slug) return null;

    return (
        <Link
            href={getExternalUrl(photo.slug)}
            target="_blank"
            rel="noreferrer"
            className="text-sm tracking-wide text-gray-500 decoration-2 underline-offset-2 hover:text-black hover:underline focus:outline-dotted focus:outline-2 focus:outline-offset-2 focus:outline-black"
        >
            <span>{photo.slug}</span>
        </Link>
    );
};

export default CarouselExternalLink;
