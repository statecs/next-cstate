import {draftMode} from 'next/headers';

export const GET = async () => {
    draftMode().disable();
    return new Response('Draft mode is disabled');
};
