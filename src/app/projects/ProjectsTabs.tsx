'use client';

import React, { useState, useMemo } from 'react';
import ProjectsGrid from '@/components/ProjectsGrid';

interface ProjectsTabsProps {
  projects: Post[];
  writings: Post[];
}

const ProjectsTabs: React.FC<ProjectsTabsProps> = ({ projects, writings }) => {
  const [kindFilter, setKindFilter] = useState<'all' | 'project' | 'case-study' | 'writing'>('all');
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sort, setSort] = useState<'Newest' | 'Oldest' | 'A–Z'>('Newest');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const allEntries = useMemo(() => {
    const merged = [...projects, ...writings];
    return merged.map((entry, i) => ({ ...entry, _index: i + 1 }));
  }, [projects, writings]);

  const byKind = useMemo(() => ({
    project: allEntries.filter(e => e.kind === 'project').length,
    'case-study': allEntries.filter(e => e.kind === 'case-study').length,
    writing: allEntries.filter(e => e.kind === 'writing').length,
  }), [allEntries]);

  const topTags = useMemo(() => {
    const freq: Record<string, number> = {};
    allEntries.forEach(e => {
      (e.category || '').split(',').forEach(t => {
        const tag = t.trim();
        if (tag) freq[tag] = (freq[tag] || 0) + 1;
      });
    });
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([tag]) => tag);
  }, [allEntries]);

  const filtered = useMemo(() => {
    let result = allEntries.filter(e => {
      if (kindFilter !== 'all' && e.kind !== kindFilter) return false;
      if (tagFilter) {
        const tags = (e.category || '').split(',').map(t => t.trim());
        if (!tags.includes(tagFilter)) return false;
      }
      return true;
    });

    if (sort === 'Newest') {
      result = [...result].sort((a, b) => (b.published > a.published ? 1 : -1));
    } else if (sort === 'Oldest') {
      result = [...result].sort((a, b) => (a.published > b.published ? 1 : -1));
    } else {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [allEntries, kindFilter, tagFilter, sort]);

  const cycleSort = () => {
    setSort(prev =>
      prev === 'Newest' ? 'Oldest' : prev === 'Oldest' ? 'A–Z' : 'Newest'
    );
  };

  const now = new Date();
  const updatedStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const kindChips: { label: string; value: 'all' | 'project' | 'case-study' | 'writing'; count: number }[] = [
    { label: 'All', value: 'all', count: allEntries.length },
    { label: 'Project', value: 'project', count: byKind.project },
    { label: 'Case Study', value: 'case-study', count: byKind['case-study'] },
    { label: 'Writing', value: 'writing', count: byKind.writing },
  ];

  return (
    <div className="flex flex-grow overflow-auto">
      <div className="w-full lg:max-w-[60%] lg:mx-auto">

        {/* Hero */}
        <section className="border-b border-zinc-200 dark:border-zinc-700 px-6 py-10 md:py-14">
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-6">
            § 01 — Index of work &nbsp;·&nbsp; A complete log, newest first
          </p>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <h1 className="font-serif text-4xl md:text-5xl xl:text-6xl leading-tight text-zinc-900 dark:text-zinc-50 max-w-2xl">
              Projects / Writing &amp; notes,<br className="hidden md:block" /> filed by year.
            </h1>
            {/* Meta card */}
            <div className="border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono text-xs shrink-0 min-w-[200px]">
              {[
                ['Entries', allEntries.length],
                ['Projects', byKind.project],
                ['Case studies', byKind['case-study']],
                ['Writing', byKind.writing],
                ['Updated', updatedStr],
              ].map(([label, val]) => (
                <div key={String(label)} className="flex justify-between px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 last:border-b-0">
                  <span className="text-zinc-500 dark:text-zinc-400 uppercase tracking-widest text-[10px]">{label}</span>
                  <span className="text-zinc-900 dark:text-zinc-100">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filter strip */}
        <section className="border-b border-zinc-200 dark:border-zinc-700">
          {/* Mobile toggle row */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-2 sm:hidden">
            <button
              onClick={() => setFiltersOpen(o => !o)}
              className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400"
            >
              <span>Filters</span>
              {(kindFilter !== 'all' || tagFilter) && (
                <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[9px] flex items-center justify-center">
                  {(kindFilter !== 'all' ? 1 : 0) + (tagFilter ? 1 : 0)}
                </span>
              )}
              <span className="text-zinc-400">{filtersOpen ? '▲' : '▼'}</span>
            </button>
            {/* View toggle always visible on mobile */}
            <div className="flex border border-zinc-300 dark:border-zinc-700 overflow-hidden">
              {(['grid', 'list'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={[
                    'font-mono text-[11px] uppercase tracking-widest px-3 py-1 transition-colors',
                    view === v
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                      : 'bg-white dark:bg-transparent text-zinc-500 dark:text-zinc-400',
                  ].join(' ')}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Filter content — always visible on sm+, toggleable on mobile */}
          <div className={[
            'px-4 sm:px-6 py-3 flex flex-wrap items-center gap-x-6 gap-y-2',
            filtersOpen ? 'flex' : 'hidden sm:flex',
          ].join(' ')}>
            {/* Kind chips */}
            <div className="flex flex-wrap gap-1.5">
              {kindChips.map(chip => (
                <button
                  key={chip.value}
                  onClick={() => setKindFilter(chip.value)}
                  className={[
                    'font-mono text-[11px] uppercase tracking-widest px-2.5 py-1 border rounded-full transition-colors',
                    kindFilter === chip.value
                      ? chip.value === 'all'
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white'
                        : 'bg-red-600 text-white border-red-600'
                      : 'bg-white dark:bg-transparent text-zinc-600 dark:text-zinc-400 border-gray-300/50 dark:border-zinc-600/50 hover:border-zinc-500 dark:hover:border-zinc-500',
                  ].join(' ')}
                >
                  {chip.label} <span className="opacity-60">{chip.count}</span>
                </button>
              ))}
            </div>

            {/* Tag chips */}
            {topTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setTagFilter(null)}
                  className={[
                    'font-mono text-[11px] uppercase tracking-widest px-2.5 py-1 border rounded-full transition-colors',
                    tagFilter === null
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white'
                      : 'bg-white dark:bg-transparent text-zinc-600 dark:text-zinc-400 border-gray-300/50 dark:border-zinc-600/50 hover:border-zinc-500',
                  ].join(' ')}
                >
                  Any
                </button>
                {topTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setTagFilter(prev => prev === tag ? null : tag)}
                    className={[
                      'font-mono text-[11px] uppercase tracking-widest px-2.5 py-1 border rounded-full transition-colors',
                      tagFilter === tag
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white'
                        : 'bg-white dark:bg-transparent text-zinc-600 dark:text-zinc-400 border-gray-300/50 dark:border-zinc-600/50 hover:border-zinc-500',
                    ].join(' ')}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {/* View toggle — desktop only (mobile has it in the toggle row) */}
            <div className="ml-auto hidden sm:flex border border-zinc-300 dark:border-zinc-700 overflow-hidden shrink-0">
              {(['grid', 'list'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={[
                    'font-mono text-[11px] uppercase tracking-widest px-3 py-1 transition-colors',
                    view === v
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                      : 'bg-white dark:bg-transparent text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800',
                  ].join(' ')}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Count bar */}
        <section className="border-b border-zinc-200 dark:border-zinc-700 px-6 py-2 flex items-center justify-between">
          <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
            Showing {filtered.length} / {allEntries.length} entries
          </span>
          <button
            onClick={cycleSort}
            className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            Sort [{sort} ↕]
          </button>
        </section>

        {/* Tick strip */}
        <div
          className="h-5 border-b border-zinc-200 dark:border-zinc-700"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 39px, var(--tick-color, #d4d4d8) 39px, var(--tick-color, #d4d4d8) 40px)',
          }}
        />

        {/* Grid / List */}
        <ProjectsGrid entries={filtered} view={view} />

      </div>
    </div>
  );
};

export default ProjectsTabs;
