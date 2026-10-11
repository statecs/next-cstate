
import {
    GithubIcon,
    LinkedinIcon,
    InstagramIcon,
    SparklesIcon,
    PencilLineIcon,
    NavigationIcon,
    BookmarkIcon,
    CircleUserIcon,
    StickerIcon
  } from 'lucide-react'

export const SCROLL_AREA_ID = 'scroll-area';

interface Profile {
  title: string;
  url: string;
  username?: string;
  icon?: JSX.Element;
}

/** Profiles linked from the hero and the footer. */
export const SOCIAL_LINKS = [
  { key: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/state/' },
  { key: 'github', label: 'GitHub', url: 'https://github.com/statecs' },
  { key: 'x', label: 'X', url: 'https://x.com/statecs' },
] as const;

export type ProductKey = 'notely' | 'altvision' | 'tillsa' | 'verifa';

export interface ProductLink {
  key: ProductKey;
  label: string;
  host: string;
  url: string;
  blurb: string;
  /** A sentence or two for the /projects cards, from the app's own site. */
  description: string;
  /**
   * Slug of the app's own page under /projects, if it has one. The cards link
   * to it, and it is left out of the "Other projects" grid so the app is not
   * listed twice.
   */
  projectSlug?: string;
  /** Where it runs, when the app's site says so. */
  platforms?: readonly string[];
  /** Shown as a pill but not linked yet; the pill says "Coming soon" instead. */
  comingSoon?: boolean;
}

/** Apps I've built, linked as quick shortcuts from the hero and the about section. */
export const PRODUCT_LINKS: readonly ProductLink[] = [
  {
    key: 'notely', label: 'Notely', host: 'notely.se', url: 'https://notely.se', blurb: 'AI notes from audio',
    description: 'Turns meetings, lectures and interviews into notes, with automatic transcription, summaries and AI insights. Transcribes and translates in 30 languages.',
    platforms: ['iOS', 'Android', 'macOS'],
    projectSlug: 'notely-ai',
  },
  {
    key: 'altvision', label: 'AltVision', host: 'altvision.se', url: 'https://altvision.se', blurb: 'AI alt text for images',
    description: 'Writes precise alt text for images by reading both the image and the text around it, and flags images that have none. Works in English and Swedish.',
    platforms: ['Chrome', 'Firefox', 'WordPress'],
    projectSlug: 'altvision',
  },
  {
    key: 'tillsa', label: 'Tillsa', host: 'tillsa.se', url: 'https://tillsa.se', blurb: 'Shared shopping list',
    description: 'One shopping and grocery list for the people you live with. Share a single link and ticks sync within seconds. Free and private.',
    platforms: ['iPhone', 'iPad', 'Mac'],
  },
  {
    key: 'verifa', label: 'Verifa', host: 'verifa.se', url: 'https://verifa.se', blurb: 'AI bookkeeping',
    description: 'Reads receipts and invoices with AI, suggests entries against the Swedish BAS chart of accounts and creates finished vouchers. For sole traders and limited companies.',
    comingSoon: true,
  },
];

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
    href: '/home#about',
    label: 'About',
    icon: <CircleUserIcon size={16} />
  },
  {
    href: '/projects',
    label: 'Projects',
    icon: <StickerIcon size={16} />
  },
];
