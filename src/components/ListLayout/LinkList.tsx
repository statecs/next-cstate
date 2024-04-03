'use client';

import Link from 'next/link'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import NewBadge from '@/components/PhotoCollection/New';
import {isCollectionNew} from '@/utils/helpers';
import Image from 'next/image';

import { cn } from '@/utils/helpers'



export const LinkList = ({ post, isMobile, isActive }: LinkListProps) => {

  const formatDate = () => {
    const dateObject = new Date(post?.published);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    };
    return dateObject.toLocaleDateString('en-US', options);
  };

  const formattedDate = formatDate();

  return (
    <LazyMotion features={domAnimation}>
    <Link
      key={post.slug}
      href={`/projects/${post.url}`}
      className={cn(
        'flex flex-row items-center gap-3 transition-colors duration-300 rounded-lg p-2',
        isActive ? 'bg-black text-white dark:bg-zinc-700' : 'dark:text-white dark:hover:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-700',
        isMobile ? 'border-b px-4 py-3 dark:border-zinc-700 text-sm' : 'rounded-lg p-2'
      )}
    >
      <Image
        alt=""
        className="transition duration-500 ease-in-out hover:duration-200 sm:group-hover:opacity-60"
        sizes="(max-width: 240px) 100vw, (max-width: 360px) 50vw, (max-width: 640px) 33vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        src={post.image || ''}
        width={70}
        height={70}
      />
      <div className="flex flex-col gap-1">
        <span className="font-medium">{post.title}</span>
        <span className={cn('transition-colors duration-300', isActive ? 'text-slate-400' : 'text-gray-400')}>
          <time dateTime={post.published} suppressHydrationWarning>
              {formattedDate}
          </time>
        </span>
        <span className={cn('transition-colors duration-300', isActive ? 'text-slate-400' : 'text-gray-400')}>
          {isCollectionNew(post.published) && <NewBadge isActive={isActive} />}
        </span>
      </div>
    </Link>
  </LazyMotion>
  
  )
}