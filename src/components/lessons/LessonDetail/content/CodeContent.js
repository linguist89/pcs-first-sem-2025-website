'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import FullScreenCode from '../FullScreenCode';

const CodeContent = ({ content }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  return (
    <div className="mb-6 overflow-hidden">
      <h2 className="text-xl font-bold text-text-primary mb-4">{content.title}</h2>
      <figure className="mb-4 relative overflow-hidden">
        <div className="rounded-lg overflow-hidden">
          <SyntaxHighlighter 
            language={content.language} 
            style={tomorrow}
            showLineNumbers={true}
            wrapLines={false}
            wrapLongLines={true}
            customStyle={{ 
              margin: 0, 
              borderRadius: '0.5rem',
              overflowX: 'auto',
              padding: '1rem',
              maxWidth: '100%'
            }}
          >
            {content.code}
          </SyntaxHighlighter>
          
          <div className="absolute top-2 right-2 flex space-x-2">
            {/* Fullscreen button */}
            <button 
              onClick={() => setIsFullScreen(true)}
              className="p-1 rounded bg-bg-primary/80 text-text-secondary hover:text-primary transition-colors"
              aria-label="View code in fullscreen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            </button>
          </div>
        </div>
        
        {content.caption && (
          <figcaption className="text-sm text-text-secondary mt-2">
            {content.caption}
          </figcaption>
        )}
      </figure>
      
      <FullScreenCode 
        isOpen={isFullScreen}
        onClose={() => setIsFullScreen(false)}
        code={content.code}
        language={content.language}
        title={content.title}
      />
    </div>
  );
};

export default CodeContent; 