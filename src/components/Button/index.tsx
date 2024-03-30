import Link from 'next/link';

interface Props {
    [key: string]: Function | string;
}

const Button: React.FC<React.PropsWithChildren<Props>> = ({children, href, ...props}) => {
    const className = `inline-block bg-gray-100 px-4 py-2.5 text-[10px] uppercase tracking-[0.5px] text-gray-700 underline-offset-4 transition duration-200 ease-out hover:bg-gray-200 hover:underline md:text-xs md:font-semibold md:tracking-[1px] dark:bg-gray-900 inline-flex items-center space-x-2 justify-center dark:text-white dark:hover:bg-gray-800 ${
        props.className || ''
    }`;

    if (href) {
        return (
            <Link href={href as string} {...props} className={className}>
                <span>{children}</span>
                <svg viewBox="0 0 256 256" className="h-4 w-4 fill-current">
                    <path d="M224,104a8,8,0,0,1-16,0V59.32l-66.33,66.34a8,8,0,0,1-11.32-11.32L196.68,48H152a8,8,0,0,1,0-16h64a8,8,0,0,1,8,8Zm-40,24a8,8,0,0,0-8,8v72H48V80h72a8,8,0,0,0,0-16H48A16,16,0,0,0,32,80V208a16,16,0,0,0,16,16H176a16,16,0,0,0,16-16V136A8,8,0,0,0,184,128Z"></path>
                </svg>
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
