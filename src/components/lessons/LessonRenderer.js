'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  TextBlock,
  CodeBlock,
  Exercise,
  Scenario,
  MediaBlock,
  Quiz
} from './content';
import InteractiveCode from './content/InteractiveCode';

const LessonRenderer = ({ content = [] }) => {
  if (!content || content.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No content available for this lesson.
      </div>
    );
  }
  
  return (
    <div className="lesson-content">
      {content.map((section, index) => {
        // Apply staggered animation for sections
        const delay = index * 0.1;
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            id={`section-${index}`}
          >
            {renderSection(section, index)}
          </motion.div>
        );
      })}
    </div>
  );
};

const renderSection = (section, index) => {
  const { type, ...props } = section;
  
  switch (type) {
    case 'text':
      return <TextBlock {...props} />;
      
    case 'code':
      return <CodeBlock {...props} />;
      
    case 'interactiveCode':
      return <InteractiveCode {...props} />;
      
    case 'exercise':
      return <Exercise {...props} />;
      
    case 'scenario':
      return <Scenario {...props} />;
      
    case 'media':
      return <MediaBlock {...props} />;
      
    case 'quiz':
      return <Quiz {...props} />;
      
    default:
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-6">
          <p className="text-yellow-700">
            Unknown content type: {type}
          </p>
        </div>
      );
  }
};

export default LessonRenderer; 