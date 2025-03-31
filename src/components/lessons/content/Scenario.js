'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

// Helper function to parse and render highlighted content
const renderHighlightedContent = (content) => {
  if (!content) return null;
  
  // Regular expression to match highlighted sections like [1 text to highlight]
  const regex = /\[(\d+)\s+(.*?)\]/g;
  
  // Split the content by the regex matches
  let parts = [];
  let lastIndex = 0;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    // Add the text before the match
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: content.substring(lastIndex, match.index)
      });
    }
    
    // Add the highlighted part
    parts.push({
      type: 'highlight',
      number: match[1],
      content: match[2]
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add any remaining text
  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.substring(lastIndex)
    });
  }
  
  // Render the parts
  return (
    <div>
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return <span key={index}>{part.content}</span>;
        } else {
          return (
            <span 
              key={index} 
              className="bg-yellow-100 dark:bg-yellow-900/40 border-b-2 border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 rounded px-1 mx-0.5 whitespace-normal"
            >
              <span className="inline-flex items-center justify-center bg-yellow-200 dark:bg-yellow-800 rounded-full h-4 w-4 text-xs font-bold mr-1 text-yellow-800 dark:text-yellow-200">
                {part.number}
              </span>
              {part.content}
            </span>
          );
        }
      })}
    </div>
  );
};

const Scenario = ({ content, title, highlightedContent, objective }) => {
  const [showHighlighted, setShowHighlighted] = useState(false);
  const [showObjective, setShowObjective] = useState(false);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[var(--background-secondary)] border border-[var(--border-light)] rounded-lg p-6 mb-6"
    >
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-[var(--text-primary)]">{title || 'Scenario'}</h3>
      </div>
      
      <div className="prose prose-sm dark:prose-invert max-w-none text-[var(--text-primary)] mb-4">
        {showHighlighted && highlightedContent ? (
          renderHighlightedContent(highlightedContent)
        ) : (
          <ReactMarkdown>
            {content}
          </ReactMarkdown>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4">
        {highlightedContent && (
          <button
            onClick={() => setShowHighlighted(!showHighlighted)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              showHighlighted 
                ? 'bg-blue-600 dark:bg-blue-500 text-white' 
                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/50'
            }`}
          >
            {showHighlighted ? 'Hide Highlighted Version' : 'Show Highlighted Version'}
          </button>
        )}
        
        {objective && (
          <button
            onClick={() => setShowObjective(!showObjective)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              showObjective 
                ? 'bg-green-600 dark:bg-green-500 text-white' 
                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/50'
            }`}
          >
            {showObjective ? 'Hide Objective' : 'Show Objective'}
          </button>
        )}
      </div>
      
      {showObjective && objective && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mt-4 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md"
        >
          <h4 className="text-md font-medium text-green-800 dark:text-green-300 mb-2">Objective</h4>
          <div className="prose prose-sm dark:prose-invert max-w-none text-[var(--text-primary)]">
            <ReactMarkdown>
              {objective}
            </ReactMarkdown>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Scenario; 