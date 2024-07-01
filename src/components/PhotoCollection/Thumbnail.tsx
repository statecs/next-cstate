import Link from 'next/link';
import ThumbnailImage from './ThumbnailImage';
import { usePathname } from 'next/navigation';

type ThumbnailPhoto = Pick<Photo, 'base64' | 'slug' | 'fullSize' | 'title'>;
interface Props extends ThumbnailPhoto {
    label?: string;
    loading?: 'eager' | 'lazy';
    path: string;
    [key: string]: any;
}

const PhotoThumbnail: React.FC<Props> = ({
    base64,
    label,
    loading = 'lazy',
    path,
    slug,
    fullSize,
    description,
    title,
    ...props
}: Props) => {
    const pathname = usePathname();
    const isWriting = pathname.startsWith('/writing');
    const basePath = isWriting ? '/writing' : '/projects';

    return (
        <Link
            aria-label={`View '${title}'`}
            className="group relative z-50 block"
            href={`${basePath}/${path}`}
            id={slug}
            title={`View '${title}'`}
            {...props}
        >
            <ThumbnailImage {...fullSize} base64={base64} loading={loading} />
            {label && (
                <span className="mt-2 block break-normal font-serif text-sm uppercase text-gray-400 transition duration-200 ease-out group-hover:text-black group-hover:underline group-hover:underline-offset-2">
                    {label}
                </span>
            )}
        </Link>
    );
};

export default PhotoThumbnail;