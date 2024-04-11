
interface TextNode {
    data: {};
    marks: [];
    value: string;
    nodeType: string;
  }
  
  interface BlockNode {
    data: {};
    content: TextNode[];
    nodeType: string;
  }
  
  interface ContentJson {
    data: {};
    content: BlockNode[];
    nodeType: string;
  }
  
  interface PageContent {
    json: ContentJson;
  }
  
  interface Page {
    content: PageContent;
    title: string;
    slug: string;
    ctaLabel: string;
    ctaUrl: string;
    openGraphImage: null | string;
    photo: null | string;
    photoNote: string;
  }
  
  interface ImageItem {
    title: string;
    url: string;
    description: string;
  }
  
  interface CollectionItem {
    sys: {
      published: string;
    };
    title: string;
    description: string;
    year: string;
    url: string | null;
    imageCollection: {
      items: ImageItem[];
    };
    journeyCollection: {
      items: any; // Adjust this based on the actual structure
    };
  }
  
  interface ContentState {
    allCollections: CollectionItem[];
    page: Page; // Adjust this based on the actual structure
  }

interface Collection {
  sys: {
    published: string; // Date string
  };
  title: string;
  url?: string;
  description?: string;
  imageCollection: {
    items: Array<{
      url: string;
      description?: string;
    }>;
  };
}

interface CollectionsByYear {
  [year: string]: Collection[];
}