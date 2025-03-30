'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * LessonSection - A container for grouping related lesson content modules
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Section title
 * @param {React.ReactNode} props.icon - Icon for the section
 * @param {React.ReactNode} props.children - Section content
 * @param {string} props.type - Section type (warmup, lesson, exercise, postlesson)
 * @param {boolean} props.isCollapsible - Whether the section can be collapsed
 * @param {boolean} props.defaultExpanded - Whether the section is expanded by default
 */
const LessonSection = ({ 
  title, 
  icon, 
  children, 
  type = 'lesson',
  isCollapsible = false,
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  // Define section styles based on type
  const sectionStyles = {
    warmup: 'border-blue-200 bg-blue-50',
    lesson: 'border-gray-200 bg-white',
    exercise: 'border-green-200 bg-green-50',
    postlesson: 'border-purple-200 bg-purple-50'
  };

  // Toggle expanded state
  const toggleExpanded = () => {
    if (isCollapsible) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`mb-8 rounded-lg border ${sectionStyles[type]} overflow-hidden`}
    >
      {/* Section header */}
      <div 
        className={`flex items-center px-6 py-4 border-b ${isCollapsible ? 'cursor-pointer' : ''} ${sectionStyles[type]}`}
        onClick={toggleExpanded}
      >
        {icon && <span className="mr-2">{icon}</span>}
        <h2 className="text-xl font-semibold">{title}</h2>
        {isCollapsible && (
          <span className="ml-auto">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'transform rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        )}
      </div>

      {/* Section content */}
      {(!isCollapsible || isExpanded) && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
};

export default LessonSection; 