interface Link {
    published?: string;
    text?: string;
    thumbnail?: Image;
    title: string;
    type?: string;
    url: string;
    image?: string; 
    description?: string; 
    date?: string;
    isPublic?: boolean;
    isMembersOnly?: boolean,
    category?: string,
}

interface LinksPage {
    linksCollection: {
        items: Link[];
    };
    text?: string;
    title: string;
}
