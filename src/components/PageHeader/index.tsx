import clsx from 'clsx';
import Link from 'next/link';
import Button from '@/components/Button';
import {getExternalUrl} from '@/utils/helpers';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, Block, Inline } from "@contentful/rich-text-types";

export interface Props {
    animate?: boolean;
    backUrl?: string;
    children?: React.ReactNode;
    ctaLabel?: string;
    ctaUrl?: string;
    description?: Description | string | null;
    hasBottomPadding?: boolean;
    pageTitle?: string;
    title?: string;
    date?: string;  // Ensure date is part of the props
}

interface Asset {
    sys: { id: string };
    contentType: string;
    url: string;
    height?: number;
    width?: number;
    description?: string;
}

type Description = {
    json: any;
    links: {
        assets?: {
            block: Asset[];
        };
    };
};


function renderOptions(links: Description['links']) {
    const assetMap = new Map();
    links?.assets?.block.forEach(asset => {
        assetMap.set(asset.sys.id, asset);
    });

    return {
        renderNode: {
            [BLOCKS.EMBEDDED_ASSET]: (node: Block | Inline) => {
                const asset = assetMap.get(node.data.target.sys.id);
    
                switch (asset.contentType) {
                    case "video/mp4":
                        return (
                            <video width="100%" height="auto" controls>
                                <source src={asset.url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        );
                    case "image/png":
                    case "image/jpeg":
                    case "image/jpg":
                        return (
                            <img
                                src={asset.url}
                                height={asset.height}
                                width={asset.width}
                                alt={asset.description || 'Image'}
                            />
                        );
                    default:
                        return null;
                }
            },
        },
    };
}

// formatDate function now accepts a date parameter
const formatDate = (date: string | number | Date) => {
    if (!date) return '';  
    const dateObject = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    };
    return dateObject.toLocaleDateString('en-US', options);
};


const PageHeader: React.FC<Props> = ({
    animate = true,
    backUrl,
    children,
    ctaLabel,
    ctaUrl,
    description,
    hasBottomPadding = true,
    pageTitle,
    title,
    date,  
}: Props) => {
    const formattedDate = date ? formatDate(date) : '';  // Handle undefined date

    return (
        <div
            className={clsx('pt-2', { 'pb-4 sm:pb-8': hasBottomPadding, 'animate-fadeIn': animate })}
            id="hero"
        >
            {title && (
                <>
                    {backUrl ? (
                        <Link
                            href={'/projects/' + backUrl}
                            className="group space-x-2 focus:outline-dotted focus:outline-2 focus:outline-offset-2 focus:outline-black sm:inline-flex sm:items-baseline"
                        >
                            <h1 className="max-w-5xl space-x-2 text-balance break-normal font-serif text-xl text-black underline-offset-4 group-hover:underline sm:text-2xl md:max-w-5xl md:text-3xl dark:text-white">
                                <span>{pageTitle || title}</span>
                            </h1>
                        </Link>
                    ) : (
                        <h1 className="max-w-5xl space-x-2 text-balance break-normal font-serif text-xl text-black underline-offset-4 group-hover:underline sm:text-2xl md:max-w-5xl md:text-3xl dark:text-white">
                            <span>{pageTitle || title}</span>
                        </h1>
                        
                    )}
                </>
            )}
            <div className="text-white pt-2 text-sm">
                <span>{formattedDate}</span>
            </div>
            {(children || description || ctaUrl) && (
                <div className="mt-4 md:mt-6">
                    {description && typeof description !== 'string' && description.json && (
                        <div className="prose-sm max-w-2xl text-balance leading-relaxed tracking-wide lg:prose-base dark:prose-invert prose-p:text-gray-500 lg:max-w-5xl lg:prose-p:leading-relaxed lg:prose-p:tracking-wide dark:prose-p:text-gray-400">
                            {documentToReactComponents(description.json, renderOptions(description.links))}
                        </div>
                    )}
                    {ctaLabel && ctaUrl && (
                        <Button
                            className="mt-4"
                            href={getExternalUrl(ctaUrl)}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            {ctaLabel}
                        </Button>
                    )}
                    {children}
                </div>
            )}
        </div>
    );
};

export default PageHeader;
