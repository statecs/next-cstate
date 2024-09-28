'use client';

import React, { useState } from 'react';

import {InstagramIcon, TwitterIcon, LinkedInIcon, GithubIcon} from '@/components/Icon';

const LINKS = [
    {label: 'Github', url: 'https://github.com/statecs'},
    {label: 'LinkedIn', url: 'https://linkedin.com/in/state'},
    {label: 'Twitter', url: 'https://twitter.com/statecs'}
];

const ICONS: {[key: string]: any} = {
    instagram: InstagramIcon,
    twitter: TwitterIcon,
    linkedin: LinkedInIcon,
    github: GithubIcon
};

const SiteMenuSocialLinks: React.FC = () => {
    const [focusedLink, setFocusedLink] = useState<string | null>(null);
  
    return (
      <ul className="flex items-center space-x-4 md:justify-center">
        {LINKS.map(link => {
          const Icon = ICONS[link.label.toLowerCase()];
  
          return (
            <li key={link.url}>
              <a
                aria-label={link.label}
                href={link.url}
                className={`
                  font-serif text-xl tracking-tight text-black duration-200 ease-out hover:opacity-60
                  md:text-xl lg:text-2xl dark:text-white
                  ${focusedLink === link.url ? 'ring-2 ring-black dark:ring-white ring-offset-2' : ''}
                `}
                rel="noreferrer"
                target="_blank"
                onFocus={() => setFocusedLink(link.url)}
                onBlur={() => setFocusedLink(null)}
              >
                <Icon className="size-5 text-current" />
              </a>
            </li>
          );
        })}
      </ul>
    );
  };

export default SiteMenuSocialLinks;