import AuroraProjectCard from '@/components/AuroraProjectCard';
import type { RelatedMatch } from '@/utils/related';

const KIND_LABEL: Record<RelatedMatch['kind'], string> = {
    project: 'Project',
    'case-study': 'Case Study',
    writing: 'Writing'
};

interface Props {
    items: RelatedMatch[];
    /** Small mono label above the heading. */
    eyebrow?: string;
    heading?: string;
}

const yearOf = (date?: string | null) => {
    if (!date) return undefined;
    const year = new Date(date).getFullYear();
    return Number.isNaN(year) ? undefined : year;
};

const RelatedPosts: React.FC<Props> = ({
    items,
    eyebrow = 'Related',
    heading = 'Keep reading'
}) => {
    if (!items.length) return null;

    return (
        <section
            aria-label={heading}
            className="border-t border-[var(--aurora-line2)] px-8 pt-12 pb-16"
        >
            <div className="max-w-6xl mx-auto">
                <div className="flex items-baseline justify-between gap-4 mb-8">
                    <h2
                        className="font-serif leading-[0.95] tracking-[-0.03em] text-[var(--aurora-text)]"
                        style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}
                    >
                        {heading}
                    </h2>
                    <span className="aurora-mono shrink-0">{eyebrow}</span>
                </div>

                <div className="aurora-grid">
                    {items.map((item, i) => (
                        <AuroraProjectCard
                            key={`${item.kind}-${item.slug}`}
                            href={item.href}
                            number={String(i + 1).padStart(3, '0')}
                            badge={KIND_LABEL[item.kind]}
                            badgeVariant={
                                item.kind === 'case-study'
                                    ? 'case-study'
                                    : item.kind === 'writing'
                                        ? 'writing'
                                        : 'default'
                            }
                            title={item.title}
                            blurb={item.subtitle || undefined}
                            // Shared tags lead, so the reason for the suggestion
                            // is the first thing read on the card.
                            tags={[
                                ...item.sharedTags,
                                ...item.tags.filter(tag => !item.sharedTags.includes(tag))
                            ]}
                            year={yearOf(item.date)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RelatedPosts;
