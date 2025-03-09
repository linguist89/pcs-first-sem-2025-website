'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import FullScreenCode from '../FullScreenCode';

const InteractiveContent = ({ content }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-text-primary mb-4">{content.title}</h2>
      <p className="mb-4 text-text-secondary">{content.description}</p>
      <figure className="mb-4 relative">
        <div className="rounded-lg overflow-hidden">
          <SyntaxHighlighter 
            language="html" 
            style={tomorrow}
            showLineNumbers={true}
            customStyle={{ 
              margin: 0, 
              borderRadius: '0.5rem',
              overflowX: 'auto',
              padding: '1rem'
            }}
          >
            {content.initialCode}
          </SyntaxHighlighter>
          
          <div className="absolute top-2 right-2 flex space-x-2">
            {/* Fullscreen button */}
            <button 
              onClick={() => setIsFullScreen(true)}
              className="bg-bg-primary p-1.5 rounded-md text-text-secondary hover:text-primary transition-colors"
              aria-label="View code in fullscreen"
              title="View code in fullscreen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            </button>
            
            {/* Try it button */}
            <button 
              className="bg-primary text-white px-2 py-1 rounded-md text-sm hover:bg-primary-dark transition-colors"
              aria-label="Try this code in playground"
              title="Try this code in playground"
            >
              Try it
            </button>
          </div>
        </div>
      </figure>
      
      {/* Fullscreen overlay */}
      <FullScreenCode 
        isOpen={isFullScreen} 
        onClose={() => setIsFullScreen(false)}
        code={content.initialCode}
        language="html"
        title={content.title}
      />
      
      <div className="bg-bg-primary border border-border-light rounded-lg p-4">
        <h3 className="font-medium text-text-primary mb-2">Instructions</h3>
        <div className="prose prose-sm max-w-none text-text-secondary">{content.instructions}</div>
      </div>
    </div>
  );
};

export default InteractiveContent; 