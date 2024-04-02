declare module 'react-use-keypress';

interface Image {
    title: string;
    url: string;
    description?: string;
}

interface JourneyCollection {
    year: string;
    imageCollection: {
        items: Image[];
    };
    description?: string;
    sys?: {published: string};
    title: string;
}

interface JourneyCollection {
    collections: JourneyCollection[];
}

interface Log {
    year: string;
    title?: string;
    description?: string;
    imageCollection?: {
        items: Image[];
    };
  }
  
  interface CollectionsByYear {
    [year: string]: Log[];
  }
  

