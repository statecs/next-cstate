'use client';

import React, { useState, useMemo } from 'react';
import AuroraProjectCard from '@/components/AuroraProjectCard';

interface ProjectsTabsProps {
    projects: Post[];
    writings: Post[];
}

const KIND_LABEL: Record<string, string> = {
    project: 'Project',
    'case-study': 'Case Study',
    writing: 'Writing',
};

const ProjectsTabs: React.FC<ProjectsTabsProps> = ({ projects, writings }) => {
    const [kindFilter, setKindFilter] = useState<'all' | 'project' | 'case-study' | 'writing'>('all');
    const [tagFilter, setTagFilter] = useState<string | null>(null);
    const [sort, setSort] = useState<'Newest' | 'Oldest' | 'A–Z'>('Newest');

    const allEntries = useMemo(() => {
        const merged = [...projects, ...writings];
        return merged.map((entry, i) => ({ ...entry, _index: i + 1 }));
    }, [projects, writings]);

    const byKind = useMemo(
        () => ({
            project: allEntries.filter(e => e.kind === 'project').length,
            'case-study': allEntries.filter(e => e.kind === 'case-study').length,
            writing: allEntries.filter(e => e.kind === 'writing').length,
        }),
        [allEntries]
    );

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
            .slice(0, 9)
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
        setSort(prev => (prev === 'Newest' ? 'Oldest' : prev === 'Oldest' ? 'A–Z' : 'Newest'));
    };

    const kindChips: { label: string; value: 'all' | 'project' | 'case-study' | 'writing'; count: number }[] = [
        { label: 'All', value: 'all', count: allEntries.length },
        { label: 'Projects', value: 'project', count: byKind.project },
        { label: 'Case Studies', value: 'case-study', count: byKind['case-study'] },
        { label: 'Writing', value: 'writing', count: byKind.writing },
    ];

    return (
        <div className="aurora-main aurora-page-shell">
            <div className="aurora-wrap">
                <div className="aurora-page-head">
                    <p className="aurora-mono">§ 01 — Index of work</p>
                    <h1>
                        Projects, writing<br />
                        &amp; <em>case studies.</em>
                    </h1>
                </div>

                <div className="aurora-filters">
                    <div role="group" aria-label="Filter by kind" className="aurora-filters-group">
                        {kindChips.map(chip => (
                            <button
                                key={chip.value}
                                type="button"
                                onClick={() => setKindFilter(chip.value)}
                                aria-pressed={kindFilter === chip.value}
                            >
                                {chip.label} <span style={{ opacity: 0.6 }}>{chip.count}</span>
                            </button>
                        ))}
                    </div>

                    {topTags.length > 0 && (
                        <>
                            <span className="aurora-filters-sep" aria-hidden="true" />
                            <div role="group" aria-label="Filter by tag" className="aurora-filters-group">
                                <button
                                    type="button"
                                    onClick={() => setTagFilter(null)}
                                    aria-pressed={tagFilter === null}
                                >
                                    Any tag
                                </button>
                                {topTags.map(tag => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => setTagFilter(prev => (prev === tag ? null : tag))}
                                        aria-pressed={tagFilter === tag}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="aurora-meta-bar">
                    <span className="aurora-mono">
                        Showing {filtered.length} / {allEntries.length} entries
                    </span>
                    <button
                        type="button"
                        onClick={cycleSort}
                        className="aurora-mono"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--aurora-muted)',
                            transition: 'color .2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--aurora-text)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--aurora-muted)')}
                    >
                        Sort [{sort} ↕]
                    </button>
                </div>

                <div className="aurora-grid" style={{ paddingBottom: 'clamp(60px,10vh,120px)' }}>
                    {filtered.map((entry, i) => {
                        const tags = (entry.category || '')
                            .split(',')
                            .map(t => t.trim())
                            .filter(Boolean);
                        const year = entry.published && entry.published !== 'Not specified'
                            ? new Date(entry.published).getFullYear()
                            : entry.date
                                ? new Date(entry.date).getFullYear()
                                : undefined;
                        const kind = entry.kind || 'project';
                        return (
                            <AuroraProjectCard
                                key={entry.url || `${entry.title}-${i}`}
                                href={entry.url}
                                number={String(entry._index).padStart(3, '0')}
                                badge={KIND_LABEL[kind] || 'Project'}
                                badgeVariant={
                                    kind === 'case-study' ? 'case-study' : kind === 'writing' ? 'writing' : 'default'
                                }
                                title={entry.title}
                                blurb={entry.description}
                                tags={tags}
                                year={year}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProjectsTabs;
