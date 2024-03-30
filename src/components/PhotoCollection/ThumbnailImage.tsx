import clsx from 'clsx';
import Image from 'next/image';

type ThumbnailPhoto = Pick<Photo['thumbnail'], 'height' | 'width' | 'url'>;
interface Props extends ThumbnailPhoto {
    base64?: string;
    loading?: 'eager' | 'lazy';
}

const ThumbnailImage: React.FC<Props> = ({base64, height, loading = 'lazy', width, url}) => (
    <span
        className={clsx(
            'block min-h-[100px] overflow-hidden bg-gray-100 transition duration-200 ease-in-out hover:duration-500 group-focus:outline-none  dark:bg-gray-900 dark:group-focus:ring-white'
        )}
    >
        <Image
            alt=""
            blurDataURL={base64 || ''}
            className="transition duration-500 ease-in-out hover:duration-200 sm:group-hover:opacity-60"
            height={height}
            placeholder={base64 ? 'blur' : 'empty'}
            loading={loading}
            quality={75}
            sizes="(max-width: 240px) 100vw, (max-width: 360px) 50vw, (max-width: 640px) 33vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            src={url}
            width={width}
        />
    </span>
);

export default ThumbnailImage;
