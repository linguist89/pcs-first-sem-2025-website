'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const Scenario = ({ content, title, highlightedContent, objective }) => {
  const [showHighlighted, setShowHighlighted] = useState(false);
  const [showObjective, setShowObjective] = useState(false);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6"
    >
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800">{title || 'Scenario'}</h3>
      </div>
      
      <div className="prose prose-sm max-w-none text-gray-700 mb-4">
        <ReactMarkdown>
          {content}
        </ReactMarkdown>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4">
        {highlightedContent && (
          <button
            onClick={() => setShowHighlighted(!showHighlighted)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              showHighlighted 
                ? 'bg-blue-600 text-white' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            {showHighlighted ? 'Hide Highlighted Parts' : 'Show Highlighted Parts'}
          </button>
        )}
        
        {objective && (
          <button
            onClick={() => setShowObjective(!showObjective)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              showObjective 
                ? 'bg-green-600 text-white' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {showObjective ? 'Hide Objective' : 'Show Objective'}
          </button>
        )}
      </div>
      
      {showHighlighted && highlightedContent && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md"
        >
          <h4 className="text-md font-medium text-blue-800 mb-2">Highlighted Parts</h4>
          <div className="prose prose-sm max-w-none text-gray-700">
            <ReactMarkdown>
              {highlightedContent}
            </ReactMarkdown>
          </div>
        </motion.div>
      )}
      
      {showObjective && objective && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md"
        >
          <h4 className="text-md font-medium text-green-800 mb-2">Objective</h4>
          <div className="prose prose-sm max-w-none text-gray-700">
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