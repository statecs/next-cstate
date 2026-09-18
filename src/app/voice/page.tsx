import type { Metadata } from 'next';
import VoicePage from './VoicePage';

export const metadata: Metadata = {
    title: 'Voice — Christopher State',
    description: 'A live voice conversation with an assistant trained on my work and experience.',
    robots: { index: false },
};

const Page = () => <VoicePage />;

export default Page;
