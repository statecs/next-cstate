import clsx from 'clsx';

interface Props {
    isActive?: boolean;
}

const NewBadge: React.FC<Props> = ({isActive}) => (
    <span
        className={clsx(
            'rounded-xl bg-black px-1.5 py-1 text-[9px] uppercase leading-[1.2] tracking-[1px] sm:leading-none md:font-semibold dark:bg-white',
            {
                'bg-opacity-10 text-black transition duration-200 ease-in-out group-hover:bg-opacity-100 group-hover:text-white dark:bg-opacity-20 dark:text-white dark:group-hover:text-black':
                    !isActive,
                'text-white dark:text-black': isActive
            }
        )}
    >
        New
    </span>
);

export default NewBadge;
