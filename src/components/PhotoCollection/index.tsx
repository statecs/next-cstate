'use client';

import clsx from 'clsx';
import PhotoThumbnail from '@/components/PhotoCollection/Thumbnail';
import usePhotoCollection from '@/hooks/usePhotoCollection';

type Props = Pick<PhotoCollection, 'photosCollection' | 'slug'>;

const PhotosCollection: React.FC<Props> = ({photosCollection, slug}) => {
    const {maxSize, photoGroups} = usePhotoCollection(
        photosCollection,
        slug === 'home' ? 'home' : 'default'
    );

    const columnClasses: {[key: number]: string} = {
        1: 'w-12/12',
        2: 'w-6/12',
        3: 'w-4/12',
        4: 'w-3/12'
    };
    const columnSize = photoGroups ? photoGroups.length : 0;
    const columnClass = columnClasses[columnSize];

    return (
        <div className="-mb-3 -ml-3 flex animate-fadeIn flex-row flex-wrap animate-duration-1000 sm:-mb-4 sm:-ml-4">
            {photoGroups?.map((row, index) => (
                <div key={index} className={`self-start pl-3 sm:pl-4 ${columnClass}`}>
                    {row.map((photo, index2) => {
                        const padding = (photo?.fullSize?.height / maxSize) * 100;

                        return (
                            <div
                                className="mb-3 h-0 w-full overflow-hidden sm:mb-4 group"
                                key={index2}
                                style={{paddingBottom: `${padding}%`}}
                            >
                                <div
                                    className={clsx(
                                        "rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] group-hover:-translate-y-1",
                                        {
                                            'mt-[-8%]': photo?.fullSize?.height > photo?.fullSize?.width
                                        }
                                    )}
                                >
                                    <PhotoThumbnail
                                        base64={photo.base64}
                                        alt={photo.description}
                                        loading={index2 < 6 ? 'eager' : 'lazy'}
                                        path={`/${photo.collection || slug}/${photo.slug}`}
                                        slug={photo.slug}
                                        title={photo.title}
                                        fullSize={photo?.fullSize}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default PhotosCollection;
