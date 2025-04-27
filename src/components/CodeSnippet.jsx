import React from 'react';

const CodeSnippet = ({ language, code }) =>
{
    return(
        <div className="bg-gray-800 rounded-md overflow-hidden my-2">
            <div className="px-4 py-2 bg-gray-900 text-gray-400 flex justify-between items-center">
                <span className="text-xs font-mono">{language}</span>
                <button className="text-xs text-blue-400 hover:text-blue-300">Copy</button>
            </div>
            <pre className="p-4 text-gray-300 font-mono text-sm overflow-x-auto">
                <code>{code}</code>
            </pre>
        </div>
    );
};

export default CodeSnippet;