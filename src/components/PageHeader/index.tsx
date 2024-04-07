import React from 'react';
import { Suspense } from 'react'
import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { getExternalUrl } from '@/utils/helpers';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, Block, Inline, INLINES } from "@contentful/rich-text-types";

export interface Props {
    animate?: boolean;
    backUrl?: string;
    children?: React.ReactNode;
    ctaLabel?: string;
    ctaUrl?: string;
    description?: Description | string | null;
    hasBottomPadding?: boolean;
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

const renderOptions = {
    renderText: (text: string) => {
      return text.split('\n').reduce<React.ReactNode[]>((children, textSegment, index) => {
        return [...children, index > 0 && <br key={index} />, textSegment];
      }, []);
    },
  };
  

  function contentfulRenderOptions(links: Description['links']) {
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
                <Suspense fallback={<LoadingSpinner />}>
                  <Image
                    src={asset.url}
                    height={asset.height}
                    width={asset.width}
                    alt={asset.description || 'Image'}
                  />
                 </Suspense>
              );
            default:
              return null;
          }
        },
        [INLINES.HYPERLINK]: (node: Block | Inline) => {
          if (node.data.uri.includes("youtube.com") || node.data.uri.includes("youtu.be")) {
            const match = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/.exec(node.data.uri);
            const videoId = match && match[7].length === 11 ? match[7] : null;
            return (
              videoId && (
                <section className="flex justify-center items-center">
                  <iframe
                    className="w-full aspect-video"
                    title={`https://youtube.com/embed/${videoId}`}
                    src={`https://youtube.com/embed/${videoId}`}
                    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                    frameBorder="0"
                    allowFullScreen
                  />
                </section>
              )
            );
          } else {
            if (node.content[0].nodeType === 'text') {
              return (
                <a href={node.data.uri} className="underline" target="_blank" rel="noopener noreferrer">
                  {node.content[0].value} →
                </a>
              );
            }
            return null;
          }
        },
        [BLOCKS.HEADING_1]: (node: Block | Inline, children: React.ReactNode) => {
            if (node.nodeType === 'heading-1') {
              return <h1 className="dark:text-white font-serif">{children}</h1>;
            }
            return null; 
          },
          [BLOCKS.HEADING_2]: (node: Block | Inline, children: React.ReactNode) => {
            if (node.nodeType === 'heading-2') {
              return <h2 className="dark:text-white font-serif">{children}</h2>;
            }
            return null;
          },
          [BLOCKS.HEADING_3]: (node: Block | Inline, children: React.ReactNode) => {
            if (node.nodeType === 'heading-3') {
              return <h3 className="dark:text-white font-serif">{children}</h3>;
            }
            return null;
          },
          [BLOCKS.HEADING_4]: (node: Block | Inline, children: React.ReactNode) => {
            if (node.nodeType === 'heading-4') {
              return <h4 className="dark:text-white font-serif">{children}</h4>;
            }
            return null;
          },
          [BLOCKS.HEADING_5]: (node: Block | Inline, children: React.ReactNode) => {
            if (node.nodeType === 'heading-5') {
              return <h5 className="dark:text-white font-serif">{children}</h5>;
            }
            return null;
          },
          [BLOCKS.HEADING_6]: (node: Block | Inline, children: React.ReactNode) => {
            if (node.nodeType === 'heading-6') {
              return <h6 className="dark:text-white font-serif">{children}</h6>;
            }
            return null;
          },
       
      },
      renderText: renderOptions.renderText,
    };
  }
  

  const formatDate = (date: string | number | Date) => {
    if (!date) return '';  
    const dateObject = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    };
    // Using 'sv-SE' for Swedish format
    return dateObject.toLocaleDateString('sv-SE', options);
};

const PageHeader: React.FC<Props> = ({
    animate = true,
    backUrl,
    children,
    ctaLabel,
    ctaUrl,
    description,
    hasBottomPadding = true,
    title,
    date,  
}: Props) => {
    const formattedDate = date ? formatDate(date) : '';

    return (
        <div
            className={clsx('pt-2', { 'pb-4 sm:pb-8': hasBottomPadding, 'animate-fadeIn': animate })}
            id="hero"
        >
            <div className="flex flex-col sm:flex-row justify-between items-start">
                <div>
                    {title && (
                        <>
                            {backUrl ? (
                                <Link
                                    href={'/projects/' + backUrl}
                                    className="group space-x-2 focus:outline-dotted focus:outline-2 focus:outline-offset-2 focus:outline-black sm:inline-flex sm:items-baseline"
                                >
                                    <h1 className="max-w-5xl space-x-2 text-balance break-normal font-serif text-xl text-black underline-offset-4 group-hover:underline sm:text-2xl md:max-w-5xl md:text-3xl dark:text-white">
                                        <span>{title}</span>
                                    </h1>
                                </Link>
                            ) : (
                                <h1 className="max-w-5xl space-x-2 text-balance break-normal font-serif text-xl text-black underline-offset-4 group-hover:underline sm:text-2xl md:max-w-5xl md:text-3xl dark:text-white">
                                    <span>{title}</span>
                                </h1>
                            )}
                        </>
                    )}
                    <div className="text-white pt-2 text-sm">
                        <span>{formattedDate}</span>
                    </div>
                </div>

                {ctaLabel && ctaUrl && typeof description !== 'string' && description?.json && (
                    <Button
                        className="mt-2 sm:mt-0 px-0 py-0 sm:text-sm sm:px-4 sm:py-3" // Adjusted text size and padding
                        href={getExternalUrl(ctaUrl)}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        {ctaLabel}
                    </Button>
                )}
                </div>
            
            {(children || description) && (
                <div className="mt-4 md:mt-6">
                    {description && typeof description !== 'string' && description.json && (
                        <div className="prose-sm max-w-2xl text-balance leading-relaxed tracking-wide lg:prose-base dark:prose-invert prose-p:text-gray-500 lg:max-w-5xl lg:prose-p:leading-relaxed lg:prose-p:tracking-wide dark:prose-p:text-gray-400">
                            {documentToReactComponents(description.json, contentfulRenderOptions(description.links))}
                        </div>
                    )}

                    {description && typeof description == 'string' && (
                        <div className="dark:text-gray-300 prose-sm max-w-2xl text-balance leading-relaxed tracking-wide lg:prose-base dark:prose-invert prose-p:text-gray-500 lg:max-w-5xl lg:prose-p:leading-relaxed lg:prose-p:tracking-wide dark:prose-p:text-gray-400">
                            {description}
                        </div>

                    )}
                    
                    {children}
                </div>
            )}
        </div>
    );
};

export default PageHeader;
