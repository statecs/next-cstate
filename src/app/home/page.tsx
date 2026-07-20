import Link from 'next/link';
import config from '@/utils/config';
import { fetchEditorialPage } from '@/utils/contentful';
import { getEditorialSeo } from '@/utils/helpers';
import ComboBox from '@/components/ComboBox';
import AuroraMarquee from '@/components/AuroraMarquee';
import AuroraAskCta from '@/components/AuroraAskCta';
import AuroraHeroFX from '@/components/AuroraHeroFX';

const CLIENTS = [
    { name: 'Siemens',    logo: '/images/logos/siemens.svg',          height: 28 },
    { name: 'Vattenfall', logo: '/images/logos/Vattenfall_logo2.svg',  height: 20 },
    { name: 'SJ',         logo: '/images/logos/SJ.svg',               height: 20 },
    { name: 'ICA',        logo: '/images/logos/ICA_logo.svg',         height: 20 },
    { name: 'Axfood',     logo: '/images/logos/AXFO.ST_BIG.svg',      height: 20 },
    { name: 'Friends',    logo: '/images/logos/Friends_logo.svg',     height: 20 },
];

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

const HomePage = async () => {
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
                        Building accessible products — from concept to code.
                    </p>
                    <div className="aurora-cta-row">
                        <Link href="/projects" className="aurora-btn primary" data-magnetic>
                            View my work <span className="arr" aria-hidden="true">→</span>
                        </Link>
                        <AuroraAskCta />
                    </div>
                </div>
                <div className="aurora-scrollcue" aria-hidden="true">
                    <div className="aurora-mouse" />
                    <span className="aurora-mono">scroll</span>
                </div>
            </section>

            {/* CLIENTS MARQUEE */}
            <section className="aurora-block" aria-label="Clients">
                <div className="aurora-wrap">
                    <div className="aurora-sec-head">
                        <h2>I&apos;ve worked with</h2>
                        <span className="aurora-mono">Selected partners</span>
                    </div>
                    <AuroraMarquee items={CLIENTS} />
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
                        <ComboBox />
                    </div>
                </div>
            </section>
        </div>
    );
};

export const generateMetadata = async () => {
    const page = await fetchEditorialPage('home') || {};
    return { ...config.seo, ...getEditorialSeo(page) };
};

export const revalidate = 86400; // 24 hours

export default HomePage;
