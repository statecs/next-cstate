import config from '@/utils/config';
import { fetchEditorialPage, fetchCollectionNavigation, fetchWritingNavigation, fetchAllJourneys } from '@/utils/contentful';
import { getEditorialSeo } from '@/utils/helpers';
import SimpleHero from '@/components/SimpleHero';
import FeaturedBanner from '@/components/FeaturedBanner';
import JourneyPreview from '@/components/JourneyPreview';
import ComboBox from '@/components/ComboBox';
import ClientLogos from '@/components/ClientLogos';

const HomePage = async () => {
    const [projectLinks, writingLinks, aboutPage, journeyData] = await Promise.all([
        fetchCollectionNavigation(),
        fetchWritingNavigation(),
        fetchEditorialPage('about'),
        fetchAllJourneys()
    ]);

    // Get featured items for banner (projects only)
    const featuredProjects = projectLinks
        .filter(link => link.image) // Only include items with images
        .slice(0, 4)
        .map(link => ({
            title: link.title,
            description: link.description || undefined,
            image: link.image as string,
            url: `/projects${link.url}`,
            category: link.category || undefined,
            type: 'project' as const
        }));

    // Use featured projects only (no writings)
    const featuredItems = featuredProjects;

    // Prepare journey events
    const journeyEvents = journeyData && Array.isArray(journeyData)
        ? journeyData
            .sort((a, b) => new Date(b.year).getFullYear() - new Date(a.year).getFullYear())
            .map(item => {
                // Create a URL-friendly slug from the title
                const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                return {
                    title: item.title,
                    description: item.description,
                    year: new Date(item.year).getFullYear().toString(),
                    url: `/about#${slug}`
                };
            })
        : [];

    return (
        <div className="flex flex-grow h-[calc(100vh)] overflow-hidden">
            <div className="w-full overflow-y-auto">
                {/* Hero Section */}
                <SimpleHero />

                {/* Bio Section */}
                <section className="w-full max-w-5xl mx-auto px-4 py-16 animate-fadeIn" style={{ animationDelay: '200ms' }}>
                    <h2
                        className="text-3xl sm:text-4xl font-bold font-serif mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                        style={{ lineHeight: '1.3' }}
                    >
                        About Me
                    </h2>
                    <p className="text-gray-300 dark:text-gray-300 text-lg sm:text-xl leading-relaxed mb-12 max-w-3xl">
                        I&apos;m a broad designer that does UX, UI, design research and strategy. Over the past 15 years, I&apos;ve led projects and designers through discovery, prototyping, launch and continuous improvement.
                    </p>

                    {/* Skills Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gray-900 dark:bg-gray-800 rounded-xl p-6 border border-gray-800 dark:border-gray-700 hover:border-gray-700 dark:hover:border-gray-600 transition-all duration-300 hover:scale-105">
                            <div className="text-4xl mb-3">♿</div>
                            <h3 className="text-white font-semibold text-lg mb-2">Accessibility</h3>
                            <p className="text-gray-400 text-sm">Building inclusive experiences for all users</p>
                        </div>
                        <div className="bg-gray-900 dark:bg-gray-800 rounded-xl p-6 border border-gray-800 dark:border-gray-700 hover:border-gray-700 dark:hover:border-gray-600 transition-all duration-300 hover:scale-105">
                            <div className="text-4xl mb-3">🎨</div>
                            <h3 className="text-white font-semibold text-lg mb-2">Design Systems</h3>
                            <p className="text-gray-400 text-sm">Creating scalable, consistent UI components</p>
                        </div>
                        <div className="bg-gray-900 dark:bg-gray-800 rounded-xl p-6 border border-gray-800 dark:border-gray-700 hover:border-gray-700 dark:hover:border-gray-600 transition-all duration-300 hover:scale-105">
                            <div className="text-4xl mb-3">⚡</div>
                            <h3 className="text-white font-semibold text-lg mb-2">Full-Stack Development</h3>
                            <p className="text-gray-400 text-sm">From frontend to backend implementation</p>
                        </div>
                        <div className="bg-gray-900 dark:bg-gray-800 rounded-xl p-6 border border-gray-800 dark:border-gray-700 hover:border-gray-700 dark:hover:border-gray-600 transition-all duration-300 hover:scale-105">
                            <div className="text-4xl mb-3">🔧</div>
                            <h3 className="text-white font-semibold text-lg mb-2">UX Engineering</h3>
                            <p className="text-gray-400 text-sm">Bridging design and development</p>
                        </div>
                    </div>
                </section>

                {/* Client Logos */}
                <ClientLogos />

                {/* AI Assistant Section */}
                <section className="w-full max-w-4xl mx-auto px-4 py-16 animate-fadeIn" style={{ animationDelay: '300ms' }}>
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 border border-blue-500/20 dark:border-blue-500/30 mb-4">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
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
                        <div className="relative bg-white dark:bg-transparent rounded-3xl shadow-xl dark:shadow-none border border-gray-200/50 dark:border-transparent p-6 sm:p-8 animate-fadeIn">
                            <ComboBox assistantId={process.env.ASSISTANT_ID || ''} />
                        </div>
                    </div>
                </section>

                {/* Featured Banner Carousel */}
                {featuredItems.length > 0 && (
                    <FeaturedBanner items={featuredItems} />
                )}

                {/* Journey Preview */}
                {journeyEvents.length > 0 && (
                    <JourneyPreview events={journeyEvents} />
                )}



                {/* Contact CTA Section */}
                <section className="w-full max-w-5xl mx-auto px-4 py-16 mb-12 animate-fadeIn" style={{ animationDelay: '800ms' }}>
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
