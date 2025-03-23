'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ content, language, caption, showLineNumbers = true }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative mb-6"
    >
      <div className="bg-gray-900 rounded-t-lg py-2 px-4 flex justify-between items-center">
        <div className="text-gray-400 text-sm font-mono">
          {language || 'code'}
        </div>
        <button 
          onClick={copyToClipboard}
          className="text-gray-400 hover:text-white text-sm flex items-center"
        >
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || 'python'}
        style={tomorrow}
        showLineNumbers={showLineNumbers}
        className="rounded-b-lg !mt-0"
        customStyle={{
          margin: 0,
          padding: '1rem',
          fontSize: '0.95rem',
          backgroundColor: '#1E293B'
        }}
      >
        {content}
      </SyntaxHighlighter>
      {caption && (
        <div className="text-sm text-gray-600 italic mt-2 px-1">
          {caption}
        </div>
      )}
    </motion.div>
  );
};

export default CodeBlock; 