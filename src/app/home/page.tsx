import config from '@/utils/config';
import ComboBox from '@/components/ComboBox';
import ProfileSection from '@/components/ProfileSection';
import AboutSection from '@/components/AboutSection';
import { fetchEditorialPage } from '@/utils/contentful';
import { getEditorialSeo } from '@/utils/helpers';
import ScrollDrawer from '@/components/ScrollDrawer';
import ClientPadding from './ClientPadding';

const HomePage = async () => {
    const page = await fetchEditorialPage('home') || {};

    return (
        <ClientPadding>
            <div className="flex flex-col space-y-2 text-center">
                <ProfileSection />
                <div className="hidden md:block mb-8">
                    <AboutSection />
                </div>

                <div className="prose-sm leading-relaxed tracking-wide dark:prose-invert prose-p:text-gray-500 dark:prose-p:text-gray-300 px-5 md:px-0 font-sans mb-8">
                    <ComboBox assistantId={process.env.ASSISTANT_ID || ''} />
                </div>

                <div className="md:hidden mb-8">
                    <ScrollDrawer />
                </div>

               
            </div>
        </ClientPadding>
    );
};

export const generateMetadata = async () => {
    const page = await fetchEditorialPage('home') || {};
    return { ...config.seo, ...getEditorialSeo(page) };
};

export const revalidate = 60;

export default HomePage;