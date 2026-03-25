import config from '@/utils/config';
import { fetchEditorialPage, fetchCollectionNavigation, fetchWritingNavigation } from '@/utils/contentful';
import { getEditorialSeo } from '@/utils/helpers';
import SimpleHero from '@/components/SimpleHero';
import ComboBox from '@/components/ComboBox';
import ClientLogos from '@/components/ClientLogos';

const HomePage = async () => {
    const [projectLinks, writingLinks, aboutPage] = await Promise.all([
        fetchCollectionNavigation(),
        fetchWritingNavigation(),
        fetchEditorialPage('about')
    ]);


    return (
        <div className="flex flex-grow h-[calc(100vh)] overflow-hidden">
            <div className="w-full overflow-y-auto">
                {/* Hero Section */}
                <SimpleHero />

                {/* Bio Section */}
                <section className="w-full max-w-5xl mx-auto px-4 py-16 animate-fadeIn opacity-0" style={{ animationDelay: '200ms' }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                        {/* Left: Bio */}
                        <div className="text-gray-700 dark:text-gray-300 text-lg sm:text-xl leading-relaxed">
                            Design Engineer based in Stockholm, working at the intersection of design and code. Focus on accessibility and user experience. Currently exploring how AI can support accessible design.
                        </div>

                        {/* Right: Skills + Location */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
                                    Top skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {['UX Research', 'Accessibility', 'Prompt Engineering'].map(skill => (
                                        <span
                                            key={skill}
                                            className="px-3 py-1.5 rounded-full text-sm font-medium bg-transparent text-gray-500 dark:text-gray-500 border border-gray-300/40 dark:border-gray-600/40"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-sm">Stockholm, Sweden</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Client Logos */}
                <ClientLogos />

                {/* AI Assistant Section */}
                <section id="ai-assistant" className="w-full max-w-4xl mx-auto px-4 py-16 animate-fadeIn opacity-0" style={{ animationDelay: '300ms' }}>
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 border border-blue-500/20 dark:border-blue-500/30 mb-4">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">AI Assistant</span>
                        </div>
                        <h2
                            className="text-3xl sm:text-4xl font-bold font-serif mb-3"
                            style={{
                                lineHeight: '1.3',
                                paddingBottom: '0.1em'
                            }}
                        >
                            <span
                                className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
                                style={{
                                    display: 'inline-block',
                                    paddingBottom: '0.08em'
                                }}
                            >
                                Ask Me Anything
                            </span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
                            Have questions? Chat with my AI assistant trained on my work and experience
                        </p>
                    </div>

                    <div className="relative">
                        {/* Main container - Clean and minimal */}
                        <div className="relative bg-white dark:bg-transparent rounded-3xl shadow-xl dark:shadow-none border border-gray-200/50 dark:border-transparent p-6 sm:p-8 animate-fadeIn opacity-0">
                            <ComboBox />
                        </div>
                    </div>
                </section>

                {/* Contact CTA Section */}
                <section className="w-full max-w-5xl mx-auto px-4 py-16 mb-12 animate-fadeIn opacity-0" style={{ animationDelay: '800ms' }}>
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-black to-gray-800 dark:from-white dark:to-gray-200 p-12 sm:p-16 text-center shadow-2xl">
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                                backgroundSize: '40px 40px'
                            }} />
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white dark:text-black mb-4 font-serif">
                                Let&apos;s Work Together
                            </h2>
                            <p className="text-white/80 dark:text-black/80 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
                                Have a project in mind or want to collaborate? I&apos;d love to hear from you.
                            </p>
                            <a
                                href="/contact"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-black text-black dark:text-white rounded-full font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                            >
                                Get in Touch
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export const generateMetadata = async () => {
    const page = await fetchEditorialPage('home') || {};
    return { ...config.seo, ...getEditorialSeo(page) };
};

export const revalidate = 86400; // 24 hours

export default HomePage;
