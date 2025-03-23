'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Exercise = ({ 
  title, 
  instructions, 
  starterCode, 
  solution,
  language = 'python',
  difficulty = 'intermediate' 
}) => {
  const [showSolution, setShowSolution] = useState(false);
  
  const difficultyClasses = {
    beginner: 'bg-green-100 text-green-800 border-green-200',
    intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    advanced: 'bg-red-100 text-red-800 border-red-200'
  };
  
  const difficultyClass = difficultyClasses[difficulty.toLowerCase()] || difficultyClasses.intermediate;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-blue-500"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">{title || 'Exercise'}</h3>
        <span className={`${difficultyClass} text-sm rounded-full px-3 py-1 font-medium border`}>
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </span>
      </div>
      
      <div className="prose prose-sm max-w-none text-gray-700 mb-4">
        <ReactMarkdown>
          {instructions}
        </ReactMarkdown>
      </div>
      
      {starterCode && (
        <div className="mb-6">
          <div className="text-sm font-medium text-gray-700 mb-2">Starter Code:</div>
          <SyntaxHighlighter
            language={language}
            style={tomorrow}
            className="rounded-lg"
            customStyle={{
              padding: '1rem',
              fontSize: '0.95rem',
              backgroundColor: '#1E293B'
            }}
          >
            {starterCode}
          </SyntaxHighlighter>
        </div>
      )}
      
      {solution && (
        <div className="mt-6">
          <button 
            onClick={() => setShowSolution(!showSolution)}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium flex items-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 mr-2 transition-transform ${showSolution ? 'rotate-90' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {showSolution ? 'Hide Solution' : 'Show Solution'}
          </button>
          
          {showSolution && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <div className="text-sm font-medium text-gray-700 mb-2">Solution:</div>
              <SyntaxHighlighter
                language={language}
                style={tomorrow}
                className="rounded-lg"
                customStyle={{
                  padding: '1rem',
                  fontSize: '0.95rem',
                  backgroundColor: '#1E293B'
                }}
              >
                {solution}
              </SyntaxHighlighter>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Exercise; 