import config from '@/utils/config';
import ComboBox from '@/components/ComboBox';
import {fetchEditorialPage} from '@/utils/contentful';
import {getEditorialSeo} from '@/utils/helpers';
import Image from 'next/image';

const HomePage = async () => {
    const page = await fetchEditorialPage('home') || {};

    return (
     <div className="flex h-[calc(100vh-110px)] flex-grow border-spacing-4 items-center justify-center">
        <div className="flex flex-col space-y-2 text-center">
            <div className="link-card inline-flex justify-center items-center gap-2 p-2">
            <Image
                src="/images/me.jpeg"
                alt="Christopher State"
                width={120}
                height={120}
                loading="lazy"
                className="rounded-full border shadow-sm"
                />
            </div>
            <div className="link-card inline-flex justify-center items-center gap-2 p-2">
                <div className="flex flex-col">
                    <h1 className="font-serif text-xl text-black sm:text-2xl dark:text-white">Christopher State</h1>
                    <span className="text-gray-400">Design Technologist</span>
                </div>
            </div>
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
