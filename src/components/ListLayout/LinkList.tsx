'use client';

import React, { forwardRef } from 'react';
import Link from 'next/link'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import NewBadge from '@/components/PhotoCollection/New';
import { isCollectionNew } from '@/utils/helpers';
import Image from 'next/image';
import { cn } from '@/utils/helpers'
import { ChevronRight, Lock } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { MembersBadge } from './MembersBadge';
import { SignedInBadge } from './SignedInBadge';
import { useAuthStatus } from '@/contexts/AuthContext';
import { useAtom } from 'jotai';
import { rolesAtom } from '@/utils/store';

export const LinkList = forwardRef<HTMLAnchorElement, LinkListProps>(({ 
  post, 
  isMobile, 
  isActive,
  isFocused,
  onFocus
}, ref) => {
  const pathname = usePathname();
  const isWriting = pathname.startsWith('/writing');
  const { isAuthenticated, loading } = useAuthStatus();
  const [roles] = useAtom(rolesAtom);

  const isNewUser = roles.some(role => role.key === 'new-users');

  const formatDate = () => {
    let dateValue = post?.date ? post.date : post?.published;
    
    if (!dateValue) {
      return '';
    }
  
    const dateObject = new Date(dateValue);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    };
  
    return dateObject.toLocaleDateString('en-US', options);
  };
    
  const formattedDate = formatDate();
  const basePath = isWriting ? '/writing' : '/projects';

  const showLock = !loading && (
    (isWriting && ((!isAuthenticated && !post.isPublic) || (isAuthenticated && isNewUser && post.isMembersOnly))) || 
    (post.isPublic == false && !isWriting && !isAuthenticated)
  );

  return (
    <LazyMotion features={domAnimation}>
      <Link
        ref={ref}
        href={`${basePath}${post.url}`}
        className={cn(
          'group flex flex-row items-center justify-between gap-3 transition-colors duration-300 rounded-lg p-2',
          (isActive || isFocused) ? 'bg-black text-white dark:bg-zinc-700' : 'dark:text-white dark:hover:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-700',
          isMobile ? 'border-b px-4 py-3 dark:border-zinc-700 text-sm' : 'rounded-lg p-2'
        )}
        aria-current={isActive ? 'location' : undefined}
        onFocus={onFocus}
      >
         <div className="flex flex-row items-center gap-3">
          {post.image && (
            <Image
              alt={post.description || ''}
              className="transition duration-500 ease-in-out hover:duration-200 sm:group-hover:opacity-60"
              sizes="(max-width: 240px) 100vw, (max-width: 360px) 50vw, (max-width: 640px) 33vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              src={post.image}
              width={70}
              height={70}
              style={{ objectFit: 'cover', height: '70px', width: '70px' }}
            />
          )}
          <div className="flex flex-col gap-1">
            <span className="font-medium">{post.title}</span>
            <span className={cn('transition-colors duration-300', isActive ? 'darK:text-slate-300' : 'text-gray-600 dark:text-gray-400')}>
              <time dateTime={post.date} suppressHydrationWarning>
                {formattedDate}
              </time>
            </span>
            <span className={cn('transition-colors duration-300', isActive ? 'dark:text-slate-300' : 'text-gray-600 dark:text-gray-400')}>
            {post.category && (
              <div className="max-w-[210px] max-h-[40px] overflow-hidden">
                <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                  {post.category?.split(',').map((cat, index, array) => (
                    <React.Fragment key={cat.trim()}>
                      <span className="font-sans text-[12px] text-gray-400 dark:text-gray-400">
                        {cat.trim()}
                      </span>
                      {index < array.length - 1 && (
                        <span>, &nbsp;</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
              {isCollectionNew(post.published) && <NewBadge isActive={isActive} />}
              {!loading && isWriting && (
                <>
                  {!isAuthenticated && !post.isPublic && (
                    <SignedInBadge isActive={isActive} />
                  )}
                  {isAuthenticated && isNewUser && post.isMembersOnly && (
                    <MembersBadge isActive={isActive} />
                  )}
                </>
              )}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {showLock && (
             <span aria-label="Login required to view this post">
               <Lock 
                 className={`
                   h-4 w-4 transition-opacity duration-200
                   ${isActive 
                     ? "opacity-100" 
                     : "opacity-50 group-hover:opacity-100"
                   }
                 `}
               />
             </span>
          )}
          <ChevronRight 
            className={`
              h-5 w-5 transition-opacity duration-200
              ${isActive 
                ? "opacity-100" 
                : "opacity-50 group-hover:opacity-100"
              }
            `}
          />
        </div>
      </Link>
    </LazyMotion>
  );
});

LinkList.displayName = 'LinkList';