interface Post {
    url: string;
    title: string;
    slug: string;
    published: string;
    image?: string;
    description?: string;
    date?: string;
    isPublic?: boolean;
    isMembersOnly?: boolean;
  }
  

  interface LinkListProps {
    post: Post;
    isMobile: boolean;
    isActive: boolean;
    isFocused?: boolean;
    onFocus?: () => void;
  }


  interface ListLayoutProps {
    list: (Post)[];
    isMobile: boolean;
  }
  
  
  interface LayoutProps {
    children: ReactNode;
  }


