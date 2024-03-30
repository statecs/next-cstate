import LinkCard from '@/components/LinksList/Card';

interface Props {
    links: LinksPage['linksCollection']['items'];
}

const LinksList: React.FC<Props> = ({links}: Props) => (
    <div className="animate-fadeIn divide-y divide-gray-200 animate-duration-1000">
        {links.map((link: Props['links'][0]) => (
            <LinkCard key={link.title} {...link} />
        ))}
    </div>
);

export default LinksList;
