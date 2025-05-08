import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';

const CodeSnippet = ({ language, code }) =>
{
    const [showCopied, setShowCopied] = useState(false);

    const handleCopy = () =>
    {
        navigator.clipboard.writeText(code).then(() =>
        {
            setShowCopied(true);
            setTimeout(() => setShowCopied(false), 2000);
        }).catch(err =>
        {
            console.error('Failed to copy:', err);
        });
    };

    return(
        <div className="bg-gray-800 rounded-md overflow-hidden my-2 relative">
            <div className="px-4 py-2 bg-gray-900 text-gray-400 flex justify-between items-center">
                <span className="text-xs font-mono">{language}</span>
                <button
                    onClick={handleCopy}
                    className="text-xs text-blue-400 hover:text-blue-300">
                    Copy
                </button>
            </div>
            <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                showLineNumbers
                customStyle={{ margin: 0, padding: '1rem' }}>
                {code}
            </SyntaxHighlighter>
            {showCopied && (
                <div className="absolute top-2 right-2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md opacity-90">
                    Copied!
                </div>
            )}
        </div>
    );
};

export default CodeSnippet;