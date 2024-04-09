import Link from 'next/link';
import { ExternalLinkIcon } from 'lucide-react'

interface Props {
    [key: string]: Function | string;
}

const Button: React.FC<React.PropsWithChildren<Props>> = ({children, href, ...props}) => {
    const className = `inline-block sm:px-4 py-2.5 text-[10px] uppercase tracking-[0.5px] text-gray-700 underline-offset-4 transition duration-200 ease-out hover:bg-gray-200 hover:underline md:text-xs md:font-semibold md:tracking-[1px] inline-flex items-center space-x-2 justify-center dark:text-white dark:hover:bg-gray-800 ${
        props.className || ''
    }`;

    if (href) {
        return (
            <Link href={href as string} {...props} className={className}>
                <span>{children}</span>
                <ExternalLinkIcon size={16} />
            </Link>
        );
    }

    return (
        <button type="button" {...props} className={className}>
            {children}
        </button>
    );
};

export default Button;
