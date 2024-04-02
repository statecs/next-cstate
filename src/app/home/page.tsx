import PageHeader from '@/components/PageHeader';
import config from '@/utils/config';
import {fetchEditorialPage} from '@/utils/contentful';
import {getEditorialSeo} from '@/utils/helpers';

const HomePage = async () => {
    const page = await fetchEditorialPage('home') || {};

    return (
     <div className="flex flex-grow border-spacing-4 items-center justify-center">
        <div className="flex flex-col space-y-2 text-center">
            <h1 className="font-serif text-xl text-black sm:text-2xl dark:text-white">Christopher State</h1>
            <div className="prose-sm leading-relaxed tracking-wide dark:prose-invert prose-p:text-gray-500 dark:prose-p:text-gray-400">
                <p>Design Technologist</p>
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
