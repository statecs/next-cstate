import config from '@/utils/config';
import { fetchEditorialPage, fetchCollectionNavigation, fetchWritingNavigation, fetchAllJourneys } from '@/utils/contentful';
import { getEditorialSeo } from '@/utils/helpers';
import HeroSection from '@/components/HeroSection';
import FeaturedBanner from '@/components/FeaturedBanner';
import JourneyPreview from '@/components/JourneyPreview';
import ComboBox from '@/components/ComboBox';

const HomePage = async () => {
    const [projectLinks, writingLinks, aboutPage, journeyData] = await Promise.all([
        fetchCollectionNavigation(),
        fetchWritingNavigation(),
        fetchEditorialPage('about'),
        fetchAllJourneys()
    ]);

    // Get featured items for banner (mix of featured projects and writings)
    const featuredProjects = projectLinks
        .filter(link => link.image) // Only include items with images
        .slice(0, 3)
        .map(link => ({
            title: link.title,
            description: link.description || undefined,
            image: link.image as string,
            url: `/projects${link.url}`,
            category: link.category || undefined,
            type: 'project' as const
        }));

    const featuredWritings = writingLinks
        .filter(link => !link.isMembersOnly && link.image) // Only include items with images
        .slice(0, 2)
        .map(link => ({
            title: link.title,
            description: link.description || undefined,
            image: link.image as string,
            url: `/writing${link.url}`,
            category: link.category || undefined,
            type: 'writing' as const
        }));

    // Combine and shuffle featured items
    const featuredItems = [...featuredProjects, ...featuredWritings]
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);

    // Prepare showcase items
    const showcaseProjects = projectLinks
        .filter(link => link.image) // Only include items with images
        .slice(0, 4)
        .map(link => ({
            title: link.title,
            image: link.image as string,
            url: `/projects${link.url}`,
            category: link.category || undefined
        }));

    const showcaseWritings = writingLinks
        .filter(link => !link.isMembersOnly && link.image) // Only include items with images
        .slice(0, 4)
        .map(link => ({
            title: link.title,
            image: link.image as string,
            url: `/writing${link.url}`,
            category: link.category || undefined
        }));

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
                <HeroSection />

                {/* AI Assistant Section */}
                <section className="w-full max-w-4xl mx-auto px-4 py-16 animate-fadeIn" style={{ animationDelay: '300ms' }}>
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 border border-blue-500/20 dark:border-blue-500/30 mb-4">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">AI Assistant</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent font-serif mb-3">
                            Ask Me Anything
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

export const revalidate = 60;

export default HomePage;
