'use client';

import React from 'react';
import {
  TextBlock,
  CodeBlock,
  Exercise,
  Scenario,
  MediaBlock,
  Quiz,
  InteractiveCode,
  CodeSlider,
  ConceptBlock
} from '../content';

/**
 * LessonModule - Determines the appropriate content component to render based on section type
 * 
 * @param {Object} props - The section data
 * @param {string} props.type - The type of section (text, code, exercise, etc.)
 * @param {boolean} props.isAdmin - Whether the current user is an admin
 */
const LessonModule = ({ type, isAdmin = false, ...props }) => {
  switch (type) {
    case 'text':
      return <TextBlock {...props} />;
      
    case 'code':
      return <CodeBlock {...props} />;
      
    case 'interactiveCode':
      return <InteractiveCode {...props} />;
      
    case 'exercise':
      return <Exercise {...props} isAdmin={isAdmin} />;
      
    case 'scenario':
      return <Scenario {...props} />;
      
    case 'media':
      return <MediaBlock {...props} />;
      
    case 'quiz':
      return <Quiz {...props} />;
      
    case 'codeSlider':
      return <CodeSlider {...props} />;
      
    case 'concept':
      return <ConceptBlock {...props} />;
      
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

export default LessonModule; 