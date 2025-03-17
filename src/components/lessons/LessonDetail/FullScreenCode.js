'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const FullScreenCode = ({ code, language, onClose }) => {
  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent scrolling of background content
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="relative w-full max-w-5xl h-[90vh] bg-[#1E293B] rounded-lg overflow-hidden flex flex-col"
        >
          {/* Header with language and close button */}
          <div className="flex justify-between items-center bg-[#0F172A] px-4 py-2">
            <div className="text-white font-mono">
              {language ? language.charAt(0).toUpperCase() + language.slice(1) : 'Code'}
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 focus:outline-none"
              aria-label="Close fullscreen code view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Code content */}
          <div className="flex-1 overflow-auto">
            <SyntaxHighlighter
              language={language}
              style={tomorrow}
              showLineNumbers={true}
              customStyle={{
                margin: 0,
                padding: '1.5rem',
                height: '100%',
                fontSize: '1rem',
                backgroundColor: '#1E293B'
              }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
          
          {/* Footer with copy button */}
          <div className="bg-[#0F172A] px-4 py-2 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigator.clipboard.writeText(code)}
              className="text-white bg-[#3B82F6] hover:bg-[#2563EB] px-3 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            >
              Copy Code
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FullScreenCode; 