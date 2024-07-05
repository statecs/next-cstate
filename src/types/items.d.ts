export interface Item {
    slug: string;
    type: 'collection' | 'writing';  // Keep this as a union type
    title: string;
    category?: string;
    ctaLabel?: string;
    ctaUrl?: string;
    date?: string;
    photosCollection: {
      items: Array<{
        fullSize: any; // Replace 'any' with the actual type if available
        base64?: string;
      }>;
    };
    description?: string;
    sys?: {
      published?: string;
    };
  }