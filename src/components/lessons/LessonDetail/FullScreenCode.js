'use client';

import { useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Full Screen Code Overlay component
const FullScreenCode = ({ isOpen, onClose, code, language, title }) => {
  if (!isOpen) return null;

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-bg-primary bg-opacity-95 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-text-primary">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-primary transition-colors"
            aria-label="Close fullscreen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-grow rounded-lg overflow-hidden">
          <SyntaxHighlighter 
            language={language} 
            style={tomorrow}
            showLineNumbers={true}
            wrapLines={false}
            customStyle={{ 
              margin: 0, 
              borderRadius: '0.5rem',
              overflowX: 'auto',
              padding: '1.5rem',
              height: '100%',
              fontSize: '1rem'
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default FullScreenCode; 