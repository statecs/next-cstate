import Link from 'next/link';
import { ArrowUpRightIcon } from 'lucide-react';
import LikeableImage from '@/components/LikeableImage';

export interface JourneyEntry {
    title?: string;
    description?: string;
    url?: string;
    year: string;
    imageCollection?: { items?: Image[] };
}

/** Stable id so the year headings and deep links survive pagination. */
export const journeySlug = (item: JourneyEntry, index: number) =>
    item.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `${item.year}-${index}`;

/**
 * One timeline row. Shared by the server-rendered first page and the pages the
 * client appends on scroll, so both halves of the list are byte-identical.
 */
const JourneyItem = ({ item, index }: { item: JourneyEntry; index: number }) => (
    <article id={journeySlug(item, index)} className="aurora-tl-item aurora-reveal">
        <div className="aurora-tl-year">{item.year}</div>
        <div>
            <h3>
                {item.url ? (
                    <Link href={item.url}>
                        {item.title}
                        <ArrowUpRightIcon size={20} aria-hidden="true" />
                    </Link>
                ) : (
                    item.title
                )}
            </h3>
            {item.description && <div className="aurora-tl-body">{item.description}</div>}
            {Array.isArray(item.imageCollection?.items) &&
                item.imageCollection!.items.slice(0, 1).map((image: Image, imgIndex: number) => (
                    <div key={imgIndex} className="aurora-tl-img">
                        <LikeableImage
                            imageId={image.sys?.id || image.url}
                            src={image.url}
                            alt={image.description || ''}
                            width={image.width}
                            height={image.height}
                            priority={false}
                        />
                    </div>
                ))}
        </div>
    </article>
);

export default JourneyItem;
