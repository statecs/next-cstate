import type { Metadata } from 'next';
import Link from 'next/link';
import config from '@/utils/config';

const LAST_UPDATED = '18 September 2026';

/**
 * Static privacy notice. Everything listed here is something the site
 * actually does — analytics, the like cookie, the assistant, sign-in and the
 * handful of browser-side preferences — so keep it in step when those change.
 */
const PrivacyPage = () => (
    <div className="aurora-main aurora-page-shell">
        <div className="aurora-wrap">
            <div className="aurora-page-head">
                <p className="aurora-mono">§ Privacy</p>
                <h1>Privacy <em>policy</em></h1>
            </div>

            <div className="aurora-legal">
                <p className="aurora-legal-lede">
                    This is a personal portfolio run by Christopher State in Stockholm, Sweden.
                    It collects as little as it can get away with. Here is what that means in practice.
                </p>
                <p className="aurora-mono">Last updated {LAST_UPDATED}</p>

                <h2>What is collected</h2>

                <h3>Analytics</h3>
                <p>
                    The site uses Google Analytics to understand which pages are read and roughly
                    where visitors come from. Google sets its own cookies for this and receives the
                    page URL, a pseudonymous client ID, your browser and device type and a truncated
                    IP address. Analytics is not loaded in development and there is no advertising or
                    cross-site tracking. You can opt out with Google&apos;s{' '}
                    <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
                        browser add-on
                    </a>{' '}
                    or by blocking the <code>googletagmanager.com</code> domain.
                </p>

                <h3>Likes on images</h3>
                <p>
                    When you like an image in the journey, the site sets a cookie named{' '}
                    <code>like_vid</code> containing a random identifier. It exists only so a like
                    counts once and can be undone. The identifier is stored on the server together with
                    the image ID and the time of the like; it is never linked to a name, email address or
                    IP address. The cookie lasts one year and is not readable by scripts.
                </p>

                <h3>Ask &amp; voice assistant</h3>
                <p>
                    Questions you type into &ldquo;Ask me anything&rdquo; and anything you say during a
                    voice session are sent to my own backend and then on to third-party AI providers
                    to produce a reply. During a voice session, audio from your microphone streams to the
                    backend only while the session is active; the browser asks for microphone permission
                    first and you can end the session at any time. The conversation is not tied to an
                    account, but please don&apos;t share personal or sensitive information with the
                    assistant, as providers process it under their own terms.
                </p>

                <h3>Signing in</h3>
                <p>
                    Some writing and projects are members-only. Sign-in is handled by{' '}
                    <a href="https://kinde.com" target="_blank" rel="noopener noreferrer">Kinde</a>, which
                    manages your account and login session. The site reads your email address and role
                    from Kinde to decide what you can see; it does not keep its own copy of your profile.
                </p>

                <h3>Email</h3>
                <p>
                    If you write to <a href="mailto:hej@cstate.se">hej@cstate.se</a>, your message is
                    kept in my mailbox for as long as our conversation needs it.
                </p>

                <h2>What stays in your browser</h2>
                <p>
                    A few things are stored with <code>localStorage</code> so the site remembers how you
                    left it: your theme and reduced-motion choices, the state of list menus, and the
                    assistant&apos;s most recent answer. None of this leaves your device and you can clear
                    it through your browser at any time.
                </p>

                <h2>Third parties</h2>
                <ul>
                    <li>
                        <strong>Contentful</strong> delivers the site&apos;s content and images. Loading a
                        page fetches images from Contentful&apos;s CDN, which sees your IP address as any
                        web server does.
                    </li>
                    <li>
                        <strong>Google Analytics</strong> for page-view statistics, as described above.
                    </li>
                    <li>
                        <strong>Kinde</strong> for authentication.
                    </li>
                    <li>
                        <strong>AI providers</strong> that generate assistant replies and speech, receiving
                        only the text or audio of the conversation.
                    </li>
                </ul>
                <p>Nothing is sold or shared with anyone else.</p>

                <h2>Server logs</h2>
                <p>
                    Like every website, the server records standard request logs — IP address, URL,
                    time and user agent — for security and to diagnose problems. They are kept for a
                    limited time and not used for anything else.
                </p>

                <h2>Your rights</h2>
                <p>
                    Under the GDPR you can ask what data I hold about you, have it corrected or deleted,
                    or object to how it is used. In most cases there won&apos;t be anything to find
                    beyond what is described here, but email{' '}
                    <a href="mailto:hej@cstate.se">hej@cstate.se</a> and I&apos;ll sort it out. You also
                    have the right to complain to the Swedish Authority for Privacy Protection (IMY).
                </p>

                <h2>Changes</h2>
                <p>
                    If the site starts collecting something new, this page will be updated first and the
                    date at the top will change. The full source is{' '}
                    <a href="https://github.com/statecs/next-cstate" target="_blank" rel="noopener noreferrer">
                        on GitHub
                    </a>{' '}
                    if you would rather read the code than the summary.
                </p>

                <p className="aurora-legal-foot">
                    <Link href="/contact">Questions? Get in touch →</Link>
                </p>
            </div>
        </div>
    </div>
);

export const metadata: Metadata = {
    ...config.seo,
    title: 'Privacy',
    description: 'What cstate.se collects, why, and what stays in your browser.',
    alternates: { canonical: `${config.seo.canonical}/privacy` },
};

export default PrivacyPage;
