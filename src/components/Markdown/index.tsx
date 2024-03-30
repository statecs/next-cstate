import ReactMarkdown from 'react-markdown';

interface Props {
    children: string;
    className?: string;
}

const MarkdownLink = (props: any) => (
    <a
        {...props}
        className="text-current text-gray-800 underline underline-offset-2 transition duration-200 ease-in-out hover:decoration-2 sm:underline-offset-4 dark:text-gray-200"
    >
        {props.children}
    </a>
);

const Markdown: React.FC<Props> = ({children, className = ''}: Props) => (
    <ReactMarkdown
        className={className}
        components={{a: ({...props}) => <MarkdownLink {...props} />}}
    >
        {children}
    </ReactMarkdown>
);

export default Markdown;
