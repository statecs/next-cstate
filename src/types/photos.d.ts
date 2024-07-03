declare module 'react-use-keypress';

interface Image {
    height: number;
    width: number;
    url: string;
}

interface Photo {
    base64?: string;
    collection?: string;
    date?: string;
    description?: string;
    fullSize: Image;
    instagramLabel?: string;
    instagramUrl?: string;
    location?: string;
    openGraphImage?: {url: string};
    slug: string;
    title: string;
}

interface PhotoCollection {
    category: string;
    ctaLabel?: string;
    ctaUrl?: string;
    date?: string;
    photosCollection: {
        items: Photo[];
    };
    description?: string;
    isFeatured?: boolean;
    isPublic?: boolean;
    isMembersOnly?: boolean;
    showInMenu?: boolean;
    showDescription?: boolean;
    slug: string;
    photoSort?: 'asc' | 'desc';
    sys?: {published: string};
    title: string;
}

interface PhotoCollections {
    collections: PhotoCollection[];
}

interface PhotoCategory {
    category?: string;
    slug: string;
    sys?: {published: string};
    title: string;
}
