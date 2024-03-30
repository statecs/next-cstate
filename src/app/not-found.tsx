import Link from 'next/link';

const NotFound = () => (
    <div className="flex h-[calc(100vh-60px)] flex-grow border-spacing-4 items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800">
        <div className="flex flex-col space-y-2 text-center">
            <h1 className="font-serif text-xl text-black sm:text-2xl dark:text-white">Not found</h1>
            <div className="prose-sm leading-relaxed tracking-wide dark:prose-invert prose-p:text-gray-500 dark:prose-p:text-gray-400">
                <p>Could not find requested resource</p>
            </div>
        </div>
    </div>
);

export default NotFound;
