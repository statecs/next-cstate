'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-jsx';

interface CodeBlockProps {
  text: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ text, language = '' }) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  useEffect(() => {
    Prism.highlightAll();
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text.replace(/<br>/g, '\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const detectLanguage = (code: string): string => {
    if (language) return language;
    if (code.includes('function') || code.includes('=>')) return 'javascript';
    if (code.includes('{') && (code.includes(':') || code.includes('@media'))) return 'css';
    if (code.includes('<') && code.includes('>')) return 'markup';
    return 'javascript';
  };

  const formatCode = (content: string): string => {
    const lang = detectLanguage(content);
    try {
      return Prism.highlight(
        content.replace(/<br>/g, '\n'),
        Prism.languages[lang],
        lang
      );
    } catch (e) {
      console.error('Prism highlight error:', e);
      return content;
    }
  };

  const lineCount = text.split('\n').length;
  const shouldShowExpand = lineCount > 15;
  const maxHeight = isExpanded ? 'none' : '300px';

  return (
    <div className="relative group my-4 w-full max-w-[90vw] sm:max-w-[85vw] md:max-w-[80vw] lg:max-w-[1000px] mx-auto">
      <pre 
        className={`bg-zinc-950 dark:bg-zinc-900 rounded-lg p-4 overflow-x-auto ${
          !isExpanded && shouldShowExpand ? 'max-h-[300px]' : ''
        }`}
        style={{ 
          maxHeight,
          transition: 'max-height 0.3s ease-in-out' 
        }}
      >
        <div className="absolute top-2 right-2 sm:opacity-0 sm:group-hover:opacity-100 opacity-100 transition-opacity flex gap-2">
          <button
            onClick={handleCopy}
            className="p-2 rounded hover:bg-zinc-800 dark:hover:bg-zinc-700"
            aria-label={copied ? "Copied!" : "Copy code"}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
        <code 
          className={`language-${detectLanguage(text)} text-sm sm:text-base whitespace-pre-wrap break-words`}
          dangerouslySetInnerHTML={{ 
            __html: formatCode(text)
          }}
        />
      </pre>
      {shouldShowExpand && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
};

export default CodeBlock;