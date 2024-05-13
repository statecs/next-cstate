import config from '@/utils/config';
import ComboBox from '@/components/ComboBox';
import ProfileSection from '@/components/ProfileSection';
import {fetchEditorialPage} from '@/utils/contentful';
import {getEditorialSeo} from '@/utils/helpers';
import ScrollDrawer from '@/components/ScrollDrawer';
import ClientPadding from './ClientPadding';

const HomePage = async () => {
    const page = await fetchEditorialPage('home') || {};
    const threadId = await generateNewThreadId();

    return (
        <ClientPadding>
            <div className="flex flex-col space-y-2 text-center">
                
                <ProfileSection />

                <div className="prose-sm leading-relaxed tracking-wide dark:prose-invert prose-p:text-gray-500 dark:prose-p:text-gray-300 px-5 md:px-0 font-serif ">
                    <ComboBox threadId={threadId} assistantId={process.env.ASSISTANT_ID || ''}  />
                </div>
            </div>
            
                <ScrollDrawer />
            
        </ClientPadding>
    );
};
const generateNewThreadId = async () => {

    const baseUrl = process.env.NEXT_PUBLIC_URL;
    const controller = new AbortController();
    const signal = controller.signal;

    try {
        
        const response = await fetch(`${baseUrl}/api/thread`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: signal
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Extract threadId from Set-Cookie header if available
        const setCookie = response.headers.get('set-cookie');
        if (setCookie && setCookie.includes('threadId')) {
            const matches = setCookie.match(/threadId=([^;]+)/);
            if (matches && matches[1]) {
                console.log("Extracted threadId from Set-Cookie:", matches[1]);
                return matches[1]; // Use the threadId from the cookie
            }
        }

        return data.threadId; // Assuming the thread ID is returned like this

    } catch (error) {
        console.error('Failed to generate new thread ID:', error);
        return null; // Handle errors or define fallback behavior
    }
};


export const generateMetadata = async () => {
    const page = await fetchEditorialPage('home') || {};
    return {...config.seo, ...getEditorialSeo(page)};
};

export const revalidate = 60;

export default HomePage;
