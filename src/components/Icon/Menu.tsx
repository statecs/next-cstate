interface Props {
    className?: string;
}

export const MenuIcon: React.FC<Props> = ({className = 'size-6 fill-current'}) => (
    <svg width="82" height="25" viewBox="0 0 82 25" aria-label="Open menu" className={className}>
        <rect width="82" height="5" fill="currentColor" />
        <rect y="20" width="82" height="5" fill="currentColor" />
    </svg>
);
