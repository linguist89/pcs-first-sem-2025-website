'use client';

import { motion } from 'framer-motion';
import TextBlock from './TextBlock';
import CodeBlock from './CodeBlock';

/**
 * ConceptBlock - A component that combines text explanation with code implementation
 * 
 * @param {Object} props
 * @param {string} props.title - The title of the concept
 * @param {string} props.explanation - Text explanation of the concept (supports markdown)
 * @param {string} props.code - The code implementation
 * @param {string} props.language - The programming language for syntax highlighting
 * @param {string} props.caption - Optional caption for the code block
 * @param {boolean} props.showLineNumbers - Whether to show line numbers in the code block
 */
const ConceptBlock = ({
  title,
  explanation,
  code,
  language = 'python',
  caption,
  showLineNumbers = true
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 mb-6 border border-blue-100"
    >
      {/* Concept explanation section */}
      <div className="mb-4">
        <TextBlock title={title} content={explanation} />
      </div>
      
      {/* Implementation divider */}
      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink mx-4 text-sm text-gray-500 font-medium">Implementation</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>
      
      {/* Code implementation section */}
      <CodeBlock
        language={language}
        content={code}
        caption={caption}
        showLineNumbers={showLineNumbers}
      />
    </motion.div>
  );
};

export default ConceptBlock; 