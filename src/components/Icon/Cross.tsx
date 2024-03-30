interface Props {
    className?: string;
}

export const CrossIcon: React.FC<Props> = ({className = 'size-6 fill-current'}) => (
    <svg width="81" height="82" viewBox="0 0 81 82" className={className} aria-label="Close menu">
        <rect
            x="21.5355"
            y="18"
            width="59.5657"
            height="5"
            transform="rotate(45 21.5355 18)"
            fill="currentColor"
        />
        <rect
            width="59.5657"
            height="5"
            transform="matrix(-0.707107 0.707107 0.707107 0.707107 60.3346 18.2291)"
            fill="currentColor"
        />
    </svg>
);
