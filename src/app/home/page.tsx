import Link from 'next/link';
import config from '@/utils/config';
import { fetchEditorialPage } from '@/utils/contentful';
import { getEditorialSeo } from '@/utils/helpers';
import ComboBox from '@/components/ComboBox';
import AuroraMarquee from '@/components/AuroraMarquee';
import AuroraAskCta from '@/components/AuroraAskCta';

const CLIENTS = ['Siemens', 'Vattenfall', 'SJ', 'ICA', 'Axfood', 'Cartina'];

const HomePage = async () => {
    return (
        <div className="aurora-main">
            {/* HERO */}
            <section className="aurora-hero" aria-label="Home">
                <div className="aurora-hero-inner">
                    <span className="aurora-eyebrow">
                        <span className="dot" aria-hidden="true" />
                        <span className="aurora-mono" style={{ color: 'var(--aurora-muted)' }}>
                            Available for new work · Stockholm
                        </span>
                    </span>
                    <h1 className="aurora-title">
                        Hi, I&apos;m<br />
                        <em>Christopher.</em>
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
