
import {
    GithubIcon,
    LinkedinIcon,
    InstagramIcon,
    YoutubeIcon,
    SparklesIcon,
    PencilLineIcon,
    NavigationIcon,
    Wand2Icon,
    BookmarkIcon,
    ArmchairIcon,
    CircleUserIcon,
    ContactIcon
  } from 'lucide-react'

export const SCROLL_AREA_ID = 'scroll-area';
export const MOBILE_SCROLL_THRESHOLD = 20;

interface Profile {
  title: string;
  url: string;
  username?: string;
  icon?: JSX.Element;
}

export const PROFILES: Record<string, Profile> = {
  github: {
    title: 'GitHub',
    url: 'https://github.com/statecs',
    icon: <GithubIcon size={16} />
  },
  linkedin: {
    title: 'LinkedIn',
    url: 'https://www.linkedin.com/in/state',
    icon: <LinkedinIcon size={16} />
  },
  instagram: {
    title: 'Instagram',
    url: 'https://www.instagram.com/cstate',
    icon: <InstagramIcon size={16} />
  },
  twitter: {
    title: 'X (Twitter)',
    username: 'statecs',
    url: 'https://twitter.com/intent/user?screen_name=statecs',
    icon: <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    width="44"
    height="44"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>,
  },
  readcv: {
    title: 'Read.cv',
    url: 'https://read.cv/cstate',
  },
};

interface Link {
  href: string;
  label: string;
  icon: JSX.Element;
}

export const LINKS: Link[] = [
  {
    href: '/',
    label: 'Home',
    icon: <SparklesIcon size={16} />
  },
  {
    href: '/about',
    label: 'About',
    icon: <CircleUserIcon size={16} />
  },
  {
    href: '/writing',
    label: 'Writing',
    icon: <PencilLineIcon size={16} />
  },
  {
    href: '/journey',
    label: 'Journey',
    icon: <NavigationIcon size={16} />
  },
  {
    href: '/links',
    label: 'Links',
    icon: <BookmarkIcon size={16} />
  },
  {
    href: '/bookmarks',
    label: 'Bookmarks',
    icon: <BookmarkIcon size={16} />
  },
  {
    href: '/contact',
    label: 'Contact',
    icon: <ContactIcon size={16} />
  },
];
