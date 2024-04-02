'use client';

import Link from 'next/link'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import NewBadge from '@/components/PhotoCollection/New';
import {isCollectionNew} from '@/utils/helpers';

import { cn } from '@/utils/helpers'

interface Post {
  url: string;
  title: string;
  slug: string;
  published: string;
}

interface WritingLinkProps {
  post: Post;
  isMobile: boolean;
  isActive: boolean;
}


export const WritingLink = ({ post, isMobile, isActive }: WritingLinkProps) => {
  const date = post?.published;

  return (
    <LazyMotion features={domAnimation}>
      <Link
        key={post.slug}
        href={`/writing/${post.url}`}
        className={cn(
          'flex flex-col gap-1 transition-colors duration-300 rounded-lg p-2',
          isActive ? 'bg-black text-white dark:bg-zinc-700' : 'dark:text-white dark:hover:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-700',
          isMobile ? 'border-b px-4 py-3 dark:border-zinc-700 text-sm' : 'rounded-lg p-2'
        )}
      >
        <span className="font-medium">{post.title}</span>
        <span className={cn('transition-colors duration-300', isActive ? 'text-slate-400' : 'text-slate-500')}>
          <time dateTime={date} suppressHydrationWarning>
              {date}
          </time>
        </span>
        
        <span className={cn('transition-colors duration-300', isActive ? 'text-slate-400' : 'text-slate-500')}>
          {isCollectionNew(post.published) && <NewBadge isActive={isActive} />}
        </span>
      </Link>
    </LazyMotion>
  )
}