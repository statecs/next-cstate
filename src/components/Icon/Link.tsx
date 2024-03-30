interface Props {
    className?: string;
}

export const LinkIcon: React.FC<Props> = ({className = 'size-6 fill-current'}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="20"
        fill="none"
        viewBox="0 0 40 20"
        className={className}
    >
        <path
            fill="currentColor"
            d="M3.8 10c0-3.42 2.78-6.2 6.2-6.2h8V0h-8C4.48 0 0 4.48 0 10s4.48 10 10 10h8v-3.8h-8c-3.42 0-6.2-2.78-6.2-6.2Zm8.2 2h16V8H12v4ZM30 0h-8v3.8h8c3.42 0 6.2 2.78 6.2 6.2 0 3.42-2.78 6.2-6.2 6.2h-8V20h8c5.52 0 10-4.48 10-10S35.52 0 30 0Z"
        />
    </svg>
);
