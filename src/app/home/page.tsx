import Link from 'next/link';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import config from '@/utils/config';
import { fetchAllJourneys, fetchEditorialPage } from '@/utils/contentful';
import { getEditorialSeo, withDescription } from '@/utils/helpers';
import { JOURNEY_PAGE_SIZE, orderJourneys } from '@/utils/journey';
import JourneyTimeline from '@/components/JourneyTimeline';
import LazyComboBox from '@/components/LazyComboBox';
import AuroraAskCta from '@/components/AuroraAskCta';
import AuroraHeroFX from '@/components/AuroraHeroFX';
import AuroraHeroHud from '@/components/AuroraHeroHud';

const SKILLS = ['UX Research', 'Accessibility', 'Prompt Engineering', 'Design Systems', 'Front-end', 'Prototyping'];

/* Per-character stagger for the hero title reveal (rendered server-side). */
const titleChars = (text: string, startMs: number, stepMs = 45) => {
    let visible = 0;
    return text.split('').map((c, i) =>
        c === ' ' ? (
            ' '
        ) : (
            <span
                key={i}
                className="ch"
                style={{ '--ch-delay': `${startMs + visible++ * stepMs}ms` } as React.CSSProperties}
            >
                {c}
            </span>
        )
    );
};

/**
 * Only the first page of the journey is sent with the document; JourneyTimeline
 * pulls the remaining pages from /api/journey as the reader scrolls.
 */
const fetchJourneyPage = async () => {
    const collections = await fetchAllJourneys();
    const all = Array.isArray(collections) ? orderJourneys(collections) : [];
    return { items: all.slice(0, JOURNEY_PAGE_SIZE), total: all.length };
};

const HomePage = async () => {
    const [journey, aboutPage] = await Promise.all([fetchJourneyPage(), fetchEditorialPage('about')]);

    const description: any = (aboutPage || {}).content;
    const bio =
        description && typeof description !== 'string' && description.json
            ? documentToReactComponents(description.json)
            : description && typeof description === 'string'
                ? <p>{description}</p>
                : null;

    return (
        <div className="aurora-main aurora-enter-page">
            {/* HERO */}
            <section className="aurora-hero" aria-label="Home">
                <AuroraHeroFX />
                <div className="aurora-hero-inner">
                    <h1 className="aurora-title" aria-label="Hi, I'm Christopher.">
                        <span aria-hidden="true">
                            {titleChars("Hi, I'm", 150)}<br />
                            <em>Christopher.</em>
                        </span>
                    </h1>
                    <p className="aurora-lede">
                        Building accessible{' '}
                        {/* The cycling words all sit in the DOM at once, so a
                            scraper reads every one of them. The first is left
                            unhidden to carry the sentence for a screen reader —
                            a separate sr-only copy would only repeat it — and
                            the spaces keep the rest from running together in a
                            search snippet. Whitespace-only nodes are not
                            rendered as grid items, so the stack is unaffected. */}
                        <span className="aurora-word-cycle">
                            <span className="w">products</span>{' '}
                            <span className="w" aria-hidden="true">interfaces</span>{' '}
                            <span className="w" aria-hidden="true">experiences</span>
                        </span>{' '}
                        — from concept to code.
                    </p>
                    <div className="aurora-cta-row">
                        <Link href="/projects" className="aurora-btn primary" data-magnetic>
                            View my work <span className="arr" aria-hidden="true">→</span>
                        </Link>
                        <AuroraAskCta />
                    </div>
                </div>
                <AuroraHeroHud />
                <div className="aurora-scrollcue" aria-hidden="true">
                    <div className="aurora-mouse" />
                    <span className="aurora-mono">scroll</span>
                </div>
            </section>

            {/* ABOUT */}
            <section className="aurora-block" id="about" aria-label="About">
                <div className="aurora-wrap">
                    <div className="aurora-sec-head">
                        <h2>About</h2>
                        <span className="aurora-mono">Design × code</span>
                    </div>

                    <div className="aurora-about-grid">
                        <div className="aurora-bio aurora-reveal">
                            <p className="aurora-bio-lead">
                                A Design Engineer at the seam of <em>design &amp; code.</em>
                            </p>
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
                </div>
            </section>

            {/* JOURNEY */}
            <section className="aurora-block" id="journey" aria-label="Journey">
                <div className="aurora-wrap">
                    <div className="aurora-sec-head">
                        <h2>Journey</h2>
                        <span className="aurora-mono">Newest first</span>
                    </div>
                    <JourneyTimeline
                        initialItems={journey.items}
                        total={journey.total}
                        pageSize={JOURNEY_PAGE_SIZE}
                    />
                </div>
            </section>

            {/* AMA */}
            <section className="aurora-block" id="ama" aria-label="Ask me anything">
                <div className="aurora-wrap">
                    <div className="aurora-ama aurora-reveal">
                        <span className="aurora-pill">
                            <span className="dot" aria-hidden="true" />
                            <span>AI Assistant</span>
                        </span>
                        <h2>Ask Me Anything</h2>
                        <p>Have questions? Chat with my AI assistant, trained on my work and experience.</p>
                        <LazyComboBox />
                    </div>
                </div>
            </section>
        </div>
    );
};

export const generateMetadata = async () => {
    const page = await fetchEditorialPage('home') || {};
    return {
        ...config.seo,
        ...getEditorialSeo(page),
        // Written for the search result rather than cut out of the bio: the
        // truncated prose read as a fragment and Google scraped the page
        // instead of using it.
        ...withDescription(
            'Christopher State is a design engineer in Stockholm building accessible products from concept to code — UX research, design systems and front-end.'
        )
    };
};

export const revalidate = 86400; // 24 hours

export default HomePage;
