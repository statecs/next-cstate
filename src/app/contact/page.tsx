import Image from 'next/image';
import { ExternalLinkIcon } from 'lucide-react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { INLINES } from '@contentful/rich-text-types';
import config from '@/utils/config';
import {fetchEditorialPage} from '@/utils/contentful';
import {getEditorialSeo} from '@/utils/helpers';

const richTextOptions = {
    renderNode: {
        [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => (
            <a
                href={node.data.uri}
                className="aurora-contact-link"
                target="_blank"
                rel="noopener noreferrer"
            >
                {children}
                <ExternalLinkIcon size={14} aria-hidden="true" />
            </a>
        ),
    },
};

const ContactPage = async () => {
    const page = await fetchEditorialPage('contact') || {};
    const content: any = page.content;
    const body = content && typeof content !== 'string' && content.json
        ? documentToReactComponents(content.json, richTextOptions)
        : content && typeof content === 'string'
        ? <p>{content}</p>
        : null;

    return (
        <div className="aurora-main aurora-page-shell">
            <div className="aurora-wrap">
                <div className="aurora-page-head">
                    <p className="aurora-mono">§ Contact</p>
                    {page.title && <h1>{page.title}</h1>}
                </div>

                <div className="aurora-contact-layout">
                    <div className="aurora-contact-content">
                        {body && (
                            <div className="aurora-contact-desc">
                                {body}
                            </div>
                        )}
                        {page.ctaUrl && !content?.json && (
                            <a
                                href={page.ctaUrl}
                                className="aurora-contact-link"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {page.ctaLabel}
                                <ExternalLinkIcon size={16} aria-hidden="true" />
                            </a>
                        )}
                    </div>

                    {page.photo?.url && (
                        <div className="aurora-contact-photo-wrap">
                            <Image
                                alt={page.photo?.description || ''}
                                style={{ width: '100%', height: 'auto' }}
                                placeholder="empty"
                                priority={false}
                                quality={90}
                                sizes="300px"
                                src={page.photo?.url}
                                width={page.photo?.width}
                                height={page.photo?.height}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const generateMetadata = async () => {
    const page = await fetchEditorialPage('contact') || {};
    return {...config.seo, ...getEditorialSeo(page)};
};

export const revalidate = 86400;

export default ContactPage;
