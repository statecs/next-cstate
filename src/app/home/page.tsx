import config from '@/utils/config';
import ComboBox from '@/components/ComboBox';
import ProfileSection from '@/components/ProfileSection';
import {fetchEditorialPage} from '@/utils/contentful';
import {getEditorialSeo} from '@/utils/helpers';

const HomePage = async () => {
    const page = await fetchEditorialPage('home') || {};

    return (
     <div className="flex h-[calc(100vh-110px)] flex-grow border-spacing-4 items-center justify-center">
        <div className="flex flex-col space-y-2 text-center">
            
            <ProfileSection />

            <div className="prose-sm leading-relaxed tracking-wide dark:prose-invert prose-p:text-gray-500 dark:prose-p:text-gray-300 px-5 md:px-0 font-serif ">
                <ComboBox threadId={process.env.THREAD_ID || ''} assistantId={process.env.ASSISTANT_ID || ''}  />
            </div>
        </div>
    </div>
    );
};

export const generateMetadata = async () => {
    const page = await fetchEditorialPage('home') || {};
    return {...config.seo, ...getEditorialSeo(page)};
};

export const revalidate = 60;

export default HomePage;
