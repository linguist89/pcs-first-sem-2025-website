'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import ReactMarkdown from 'react-markdown';

const InteractiveCode = ({
  title,
  description,
  starterCode = '',
  language = 'python',
  solution = '',
  caption,
  showLineNumbers = true,
  instructions = ''
}) => {
  const [code, setCode] = useState(starterCode);
  const [isEditing, setIsEditing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const textareaRef = useRef(null);

  // Auto-size the textarea in edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing, code]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleReset = () => {
    setCode(starterCode);
    setIsEditing(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const toggleSolution = () => {
    setShowSolution(!showSolution);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      )}
      
      {description && (
        <div className="text-gray-700 mb-3">
          <ReactMarkdown>{description}</ReactMarkdown>
        </div>
      )}

      <div className="relative border border-gray-200 rounded-lg overflow-hidden">
        {/* Code header with actions */}
        <div className="bg-gray-900 py-2 px-4 flex justify-between items-center">
          <div className="text-gray-400 text-sm font-mono">
            {language}
          </div>
          <div className="flex space-x-2">
            {!isEditing ? (
              <>
                <button
                  onClick={copyToClipboard}
                  className="text-gray-400 hover:text-white text-sm flex items-center px-2 py-1 rounded hover:bg-gray-800"
                  title="Copy code"
                >
                  {isCopied ? (
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
                <button
                  onClick={handleEdit}
                  className="text-gray-400 hover:text-white text-sm flex items-center px-2 py-1 rounded hover:bg-gray-800"
                  title="Edit code"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="text-gray-400 hover:text-white text-sm flex items-center px-2 py-1 rounded hover:bg-gray-800"
                  title="Save changes"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save
                </button>
                <button
                  onClick={handleReset}
                  className="text-gray-400 hover:text-white text-sm flex items-center px-2 py-1 rounded hover:bg-gray-800"
                  title="Reset code"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset
                </button>
              </>
            )}
          </div>
        </div>

        {/* Code content area */}
        <div className="relative">
          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-4 bg-gray-900 text-gray-200 font-mono text-sm focus:outline-none resize-none"
              style={{ minHeight: '150px', lineHeight: '1.5' }}
              spellCheck="false"
              autoFocus
            />
          ) : (
            <SyntaxHighlighter
              language={language}
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
              {code}
            </SyntaxHighlighter>
          )}
        </div>
      </div>

      {caption && (
        <div className="text-sm text-gray-600 italic mt-2 px-1">
          {caption}
        </div>
      )}

      {instructions && (
        <div className="mt-3 bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="font-medium text-blue-800 mb-1">Instructions</div>
          <div className="text-blue-700 text-sm">
            <ReactMarkdown>{instructions}</ReactMarkdown>
          </div>
        </div>
      )}

      {solution && (
        <div className="mt-4">
          <button
            onClick={toggleSolution}
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 mr-1 transition-transform ${showSolution ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {showSolution ? 'Hide Solution' : 'Show Solution'}
          </button>

          {showSolution && (
            <div className="mt-3 border border-green-200 rounded-lg overflow-hidden">
              <div className="bg-green-100 py-2 px-4">
                <span className="text-green-800 text-sm font-medium">Solution</span>
              </div>
              <SyntaxHighlighter
                language={language}
                style={tomorrow}
                showLineNumbers={showLineNumbers}
                customStyle={{
                  margin: 0,
                  padding: '1rem',
                  fontSize: '0.95rem',
                  backgroundColor: '#1E293B'
                }}
              >
                {solution}
              </SyntaxHighlighter>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default InteractiveCode; 