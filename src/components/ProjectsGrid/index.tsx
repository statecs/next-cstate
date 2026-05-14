'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { isCollectionNew } from '@/utils/helpers';
import NewBadge from '@/components/PhotoCollection/New';

type EntryWithIndex = Post & { _index?: number };

interface ProjectsGridProps {
  entries: EntryWithIndex[];
  view?: 'grid' | 'list';
  // Legacy prop — old callers pass `projects` without view
  projects?: Post[];
}

function getHref(post: Post): string {
  if (post.kind === 'writing') return `/writing${post.url}`;
  return `/projects${post.url}`;
}

function formatYear(published: string): string {
  if (!published || published === 'Not specified') return '—';
  const d = new Date(published);
  return isNaN(d.getFullYear()) ? '—' : String(d.getFullYear());
}

function padIndex(n: number | undefined): string {
  if (n == null) return '№';
  return `№ ${String(n).padStart(3, '0')}`;
}

function TypeBadge({ kind }: { kind?: Post['kind'] }) {
  if (!kind) return null;
  const map: Record<string, string> = {
    'project': 'border border-zinc-400 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400',
    'case-study': 'bg-red-600 text-white',
    'writing': 'border border-zinc-400 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400',
  };
  const label: Record<string, string> = {
    'project': 'Project',
    'case-study': 'Case Study',
    'writing': 'Writing',
  };
  return (
    <span className={`font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded ${map[kind]}`}>
      {label[kind]}
    </span>
  );
}

function WritingThumb({ title }: { title: string }) {
  return (
    <div
      className="w-full h-full flex items-end p-3"
      style={{
        backgroundImage: 'repeating-linear-gradient(45deg,var(--hatching,#E8E4DB) 0 10px,transparent 10px 20px)',
      }}
    >
      <span className="text-base font-medium leading-snug text-zinc-700 dark:text-zinc-200 line-clamp-3">
        {title}
      </span>
    </div>
  );
}

function isFeatured(i: number, post: EntryWithIndex): boolean {
  return post.kind === 'case-study' || i % 7 === 0;
}

function GridCard({ post, featured = false }: { post: EntryWithIndex; featured?: boolean }) {
  const href = getHref(post);
  const year = formatYear(post.published);
  const tags = (post.category || '').split(',').map(t => t.trim()).filter(Boolean).slice(0, 3);
  const isNew = isCollectionNew(post.date);

  return (
    <article className={`relative flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden group transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/30${featured ? ' sm:col-span-2' : ''}`}>
      <Link href={href} className="flex flex-col flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600">

        {/* Thumb */}
        <div className="aspect-[4/3] overflow-hidden border-b border-zinc-200 dark:border-zinc-800 relative bg-zinc-100 dark:bg-zinc-900 rounded-t-md">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.015] saturate-[0.92] contrast-[1.03]"
              sizes={featured
                ? "(max-width: 640px) 100vw, (max-width: 1280px) 66vw, 50vw"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              }
            />
          ) : (
            <WritingThumb title={post.title} />
          )}

          {/* Index badge */}
          <span className="absolute top-2 left-2 font-mono text-[9px] bg-zinc-900/80 text-zinc-100 px-1.5 py-0.5 leading-none">
            {padIndex(post._index)}
          </span>

          {/* Badges top-right */}
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
            {isNew && <NewBadge />}
            <TypeBadge kind={post.kind} />
          </div>

          {/* Watermark */}
          <span className="absolute bottom-2 right-2 font-mono text-[9px] text-white/40 mix-blend-difference select-none pointer-events-none">
            CST · {String(post._index ?? '').padStart(3, '0')}
          </span>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          <h3 className={`font-serif text-xl leading-snug font-normal text-gray-900 dark:text-gray-100 ${featured ? 'line-clamp-3' : 'line-clamp-2'}`}>
            {post.title}
          </h3>

          {featured && post.description && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 -mt-1">
              {post.description}
            </p>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-300/50 dark:border-zinc-600/50 text-zinc-500 dark:text-zinc-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Meta line */}
          <div className="mt-auto pt-2 border-t border-dashed border-zinc-200 dark:border-zinc-700 flex justify-between items-center">
            <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500">{year}</span>
            <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 group-hover:text-red-600 transition-colors">
              View →
            </span>
          </div>
        </div>

      </Link>
    </article>
  );
}

function ListRow({ post }: { post: EntryWithIndex }) {
  const href = getHref(post);
  const year = formatYear(post.published);
  const tags = (post.category || '').split(',').map(t => t.trim()).filter(Boolean).slice(0, 2);

  return (
    <a
      href={href}
      className="grid grid-cols-[2.5rem_1fr_4rem_5rem] sm:grid-cols-[2.5rem_1fr_1fr_auto_3rem_6rem] gap-x-3 sm:gap-x-4 items-baseline px-4 sm:px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group"
    >
      <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 tabular-nums">{padIndex(post._index)}</span>
      <span className="font-serif text-sm sm:text-base text-zinc-900 dark:text-zinc-50 truncate min-w-0">{post.title}</span>
      {/* Subtitle — hidden on mobile */}
      <span className="hidden sm:block font-mono text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{post.description || ''}</span>
      {/* Tags — hidden on mobile */}
      <div className="hidden sm:flex gap-1 flex-wrap">
        {tags.map(tag => (
          <span
            key={tag}
            className="px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-300/50 dark:border-zinc-600/50 text-zinc-500 dark:text-zinc-400 whitespace-nowrap"
          >
            {tag}
          </span>
        ))}
      </div>
      <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 tabular-nums text-right">{year}</span>
      <span className="flex justify-end"><TypeBadge kind={post.kind} /></span>
    </a>
  );
}

const ProjectsGrid: React.FC<ProjectsGridProps> = ({ entries, view = 'grid', projects }) => {
  // Legacy support: if called with `projects` prop (old API), render as grid
  const items: EntryWithIndex[] = entries ?? (projects ?? []).map((p, i) => ({ ...p, _index: i + 1 }));

  if (items.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="font-mono text-sm text-zinc-400 dark:text-zinc-500">No entries match the current filters.</p>
      </div>
    );
  }

  if (view === 'list') {
    return (
      <div className="w-full">
        {/* Header row */}
        <div className="grid grid-cols-[2.5rem_1fr_4rem_5rem] sm:grid-cols-[2.5rem_1fr_1fr_auto_3rem_6rem] gap-x-3 sm:gap-x-4 items-baseline px-4 sm:px-6 py-2 border-b border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900">
          {['№', 'Title', 'Year', 'Type'].map(h => (
            <span key={h} className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 sm:hidden">{h}</span>
          ))}
          {['№', 'Title', 'Subtitle', 'Tags', 'Year', 'Type'].map(h => (
            <span key={`d-${h}`} className="hidden sm:block font-mono text-[9px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">{h}</span>
          ))}
        </div>
        {items.map(post => (
          <ListRow key={post.slug} post={post} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 grid-flow-row-dense">
      {items.map((post, i) => (
        <GridCard key={post.slug} post={post} featured={isFeatured(i, post)} />
      ))}
    </div>
  );
};

export default ProjectsGrid;
