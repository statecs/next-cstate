import clsx from 'clsx';
import Link from 'next/link';
import Button from '@/components/Button';
import Markdown from '@/components/Markdown';
import {getExternalUrl} from '@/utils/helpers';

export interface Props {
    animate?: boolean;
    backUrl?: string;
    children?: React.ReactNode;
    ctaLabel?: string;
    ctaUrl?: string;
    description?: string | null;
    hasBottomPadding?: boolean;
    pageTitle?: string;
    title?: string;
}

const PageHeader: React.FC<Props> = ({
    animate = true,
    backUrl,
    children,
    ctaLabel,
    ctaUrl,
    description,
    hasBottomPadding = true,
    pageTitle,
    title
}: Props) => (
    <div
        className={clsx('pt-2', {'pb-4 sm:pb-8': hasBottomPadding, 'animate-fadeIn': animate})}
        id="hero"
    >
        {title && (
            <>
                {backUrl ? (
                    <Link
                        href={backUrl}
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
        {(children || description || ctaUrl) && (
            <div className="mt-4 md:mt-6" key={description || children?.toString()}>
                {description && (
                    <Markdown className="prose-sm max-w-2xl text-balance leading-relaxed tracking-wide lg:prose-base dark:prose-invert prose-p:text-gray-500 lg:max-w-5xl lg:prose-p:leading-relaxed lg:prose-p:tracking-wide dark:prose-p:text-gray-400">
                        {description}
                    </Markdown>
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
                {children && children}
            </div>
        )}
    </div>
);

export default PageHeader;
