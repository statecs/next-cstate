import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRightIcon } from 'lucide-react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import config from '@/utils/config';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { fetchAllJourneys, fetchEditorialPage } from '@/utils/contentful';
import { getEditorialSeo } from '@/utils/helpers';

export const generateMetadata = async () => {
    const page = await fetchEditorialPage('about') || {};
    return { ...config.seo, ...getEditorialSeo(page) };
};

export const revalidate = 86400;

const SKILLS = ['UX Research', 'Accessibility', 'Prompt Engineering', 'Design Systems', 'Front-end', 'Prototyping'];

async function fetchData() {
    const collections = await fetchAllJourneys();
    if (!Array.isArray(collections)) {
        return { allCollections: {} as CollectionsByYear };
    }
    const allCollections = collections.reduce<CollectionsByYear>((acc, log) => {
        const year = new Date(log.year).getFullYear().toString();
        if (!acc[year]) acc[year] = [];
        acc[year].push({ ...log, year });
        return acc;
    }, {});
    return { allCollections };
}

export default async function AboutPage() {
    const { allCollections } = await fetchData();
    const page = (await fetchEditorialPage('about')) || {};

    const description: any = page.content;
    const bio =
        description && typeof description !== 'string' && description.json
            ? documentToReactComponents(description.json)
            : description && typeof description === 'string'
                ? <p>{description}</p>
                : null;

    const years = Object.entries(allCollections).sort(([a], [b]) => b.localeCompare(a));

    return (
        <div className="aurora-main aurora-page-shell">
            <div className="aurora-wrap">
                <div className="aurora-page-head">
                    <p className="aurora-mono">§ About — design × code</p>
                    <h1>
                        A Design Engineer<br />
                        at the seam of<br />
                        <em>design &amp; code.</em>
                    </h1>
                </div>

                <div className="aurora-about-grid">
                    <div className="aurora-bio aurora-reveal">
                        {bio || (
                            <>
                                <p>
                                    Hi, I&apos;m Christopher State, a Design Engineer based in Stockholm.
                                    I work at the intersection of design and code, focusing on accessibility
                                    and user experience.
                                </p>
                                <p>
                                    Previously, I led accessibility initiatives at SJ, shaped digital products
                                    at ICA, and supported Vattenfall&apos;s ERP transformation through UX-focused
                                    training programmes. Currently, I&apos;m exploring how AI can support
                                    accessible design.
                                </p>
                            </>
                        )}
                    </div>

                    <aside className="aurora-side-card aurora-reveal">
                        <h3>Top skills</h3>
                        <div className="aurora-chips">
                            {SKILLS.map(skill => (
                                <span key={skill} className="aurora-chip">{skill}</span>
                            ))}
                        </div>
                        <div className="aurora-loc">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                                <path d="M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11Z" />
                                <circle cx="12" cy="10" r="2.4" />
                            </svg>
                            <span>Stockholm, Sweden</span>
                        </div>
                    </aside>
                </div>

                <section className="aurora-block" style={{ padding: 'clamp(40px,8vh,90px) 0' }} aria-label="Journey">
                    <div className="aurora-sec-head">
                        <h2>Journey</h2>
                        <span className="aurora-mono">Newest first</span>
                    </div>
                    <div className="aurora-timeline">
                        <Suspense fallback={<LoadingSpinner />}>
                            {years.length > 0 ? (
                                years.flatMap(([year, events]) =>
                                    (Array.isArray(events) ? events : []).map((item, i) => {
                                        const slug = item.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `${year}-${i}`;
                                        return (
                                            <article key={`${year}-${slug}-${i}`} id={slug} className="aurora-tl-item aurora-reveal">
                                                <div className="aurora-tl-year">{year}</div>
                                                <div>
                                                    <h3>
                                                        {item.url ? (
                                                            <Link href={item.url}>
                                                                {item.title}
                                                                <ArrowUpRightIcon size={20} aria-hidden="true" />
                                                            </Link>
                                                        ) : (
                                                            item.title
                                                        )}
                                                    </h3>
                                                    {item.description && (
                                                        <div className="aurora-tl-body">{item.description}</div>
                                                    )}
                                                    {Array.isArray(item.imageCollection?.items) &&
                                                        item.imageCollection!.items.slice(0, 1).map((image: Image, imgIndex: number) => (
                                                            <div key={imgIndex} className="aurora-tl-img">
                                                                <Image
                                                                    src={image.url}
                                                                    alt={image.description || ''}
                                                                    width={0}
                                                                    height={0}
                                                                    sizes="(max-width: 768px) 100vw, 700px"
                                                                    style={{ width: '100%', height: 'auto' }}
                                                                    loading={imgIndex < 1 ? 'eager' : 'lazy'}
                                                                    className="w-full object-cover"
                                                                />
                                                            </div>
                                                        ))}
                                                </div>
                                            </article>
                                        );
                                    })
                                )
                            ) : (
                                <p style={{ color: 'var(--aurora-muted)' }}>No journey entries to display.</p>
                            )}
                        </Suspense>
                    </div>
                </section>
            </div>
        </div>
    );
}
