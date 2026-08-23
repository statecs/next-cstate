'use client';

import React, { useState, useMemo } from 'react';
import AuroraProjectCard from '@/components/AuroraProjectCard';
import { formatProjectDate } from '@/utils/projectIndex';

interface ProjectsTabsProps {
    projects: Post[];
}

const KIND_LABEL: Record<string, string> = {
    project: 'Project',
    'case-study': 'Case Study',
};

const ProjectsTabs: React.FC<ProjectsTabsProps> = ({ projects }) => {
    const [tagFilter, setTagFilter] = useState<string | null>(null);
    const [sort, setSort] = useState<'Newest' | 'Oldest' | 'A–Z'>('Newest');
    // The staged entrance only plays on first paint — once the user touches a
    // filter, cards swap in instantly instead of re-staggering.
    const [interacted, setInteracted] = useState(false);
    const enterClass = interacted ? '' : 'aurora-enter';
    const enterStyle = (delay: number): React.CSSProperties | undefined =>
        interacted ? undefined : ({ '--enter-delay': `${delay}ms` } as React.CSSProperties);

    const allEntries = useMemo(
        () => projects.map((entry, i) => ({ ...entry, _index: i + 1 })),
        [projects]
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
            if (!tagFilter) return true;
            return (e.category || '').split(',').map(t => t.trim()).includes(tagFilter);
        });

        if (sort === 'Newest') {
            result = [...result].sort((a, b) => (b.published > a.published ? 1 : -1));
        } else if (sort === 'Oldest') {
            result = [...result].sort((a, b) => (a.published > b.published ? 1 : -1));
        } else {
            result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        }

        return result;
    }, [allEntries, tagFilter, sort]);

    const cycleSort = () => {
        setInteracted(true);
        setSort(prev => (prev === 'Newest' ? 'Oldest' : prev === 'Oldest' ? 'A–Z' : 'Newest'));
    };

    return (
        <div className="aurora-main aurora-page-shell">
            <div className="aurora-wrap">
                <div className="aurora-page-head">
                    <p className={`aurora-mono ${enterClass}`} style={enterStyle(0)}>§ 01 — Index of work</p>
                    <h1 className={enterClass} style={enterStyle(160)}>
                        <em>Projects.</em>
                    </h1>
                </div>

                <div className={`aurora-filters ${enterClass}`} style={enterStyle(420)}>
                    {topTags.length > 0 && (
                        <div role="group" aria-label="Filter by tag" className="aurora-filters-group">
                            <button
                                type="button"
                                onClick={() => { setInteracted(true); setTagFilter(null); }}
                                aria-pressed={tagFilter === null}
                            >
                                Any tag
                            </button>
                            {topTags.map(tag => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => { setInteracted(true); setTagFilter(prev => (prev === tag ? null : tag)); }}
                                    aria-pressed={tagFilter === tag}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className={`aurora-meta-bar ${enterClass}`} style={enterStyle(560)}>
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
                        const kind = entry.kind || 'project';
                        return (
                            <AuroraProjectCard
                                key={entry.url || `${entry.title}-${i}`}
                                href={entry.url}
                                number={String(entry._index).padStart(3, '0')}
                                badge={KIND_LABEL[kind] || 'Project'}
                                badgeVariant={kind === 'case-study' ? 'case-study' : 'default'}
                                title={entry.title}
                                blurb={entry.description}
                                tags={tags}
                                dateLabel={formatProjectDate(entry)}
                                image={entry.image || undefined}
                                style={
                                    interacted
                                        ? undefined
                                        : ({ '--reveal-delay': `${700 + Math.min(i, 8) * 110}ms` } as React.CSSProperties)
                                }
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProjectsTabs;
