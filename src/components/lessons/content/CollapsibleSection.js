'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CollapsibleSection = ({ 
  title, 
  children, 
  defaultCollapsed = true,
  type = 'default',
  icon
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  
  // Update isCollapsed when defaultCollapsed changes (e.g., when a section is selected from sidebar)
  useEffect(() => {
    setIsCollapsed(defaultCollapsed);
  }, [defaultCollapsed]);
  
  // Define styling based on section type
  const typeStyles = {
    warmup: {
      border: 'border-green-400',
      background: 'bg-gradient-to-r from-green-50 to-green-100',
      text: 'text-green-800',
      icon: 'text-green-600',
      hover: 'hover:bg-green-100',
    },
    lesson: {
      border: 'border-blue-400',
      background: 'bg-gradient-to-r from-blue-50 to-blue-100',
      text: 'text-blue-800',
      icon: 'text-blue-600',
      hover: 'hover:bg-blue-100',
    },
    exercise: {
      border: 'border-yellow-400',
      background: 'bg-gradient-to-r from-yellow-50 to-yellow-100',
      text: 'text-yellow-800',
      icon: 'text-yellow-600',
      hover: 'hover:bg-yellow-100',
    },
    postlesson: {
      border: 'border-purple-400',
      background: 'bg-gradient-to-r from-purple-50 to-purple-100',
      text: 'text-purple-800',
      icon: 'text-purple-600',
      hover: 'hover:bg-purple-100',
    },
    default: {
      border: 'border-gray-400',
      background: 'bg-gradient-to-r from-gray-50 to-gray-100',
      text: 'text-gray-800',
      icon: 'text-gray-600',
      hover: 'hover:bg-gray-100',
    }
  };
  
  const styles = typeStyles[type] || typeStyles.default;
  
  return (
    <div className={`mb-6 rounded-lg border-l-4 shadow-sm ${styles.border} overflow-hidden transition-all duration-300 ease-in-out`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`w-full px-4 py-3 flex justify-between items-center ${styles.background} ${styles.text} ${styles.hover} transition-colors duration-200`}
        aria-expanded={!isCollapsed}
      >
        <div className="flex items-center">
          {icon && <span className={`mr-2 ${styles.icon}`}>{icon}</span>}
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <motion.svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 ${styles.icon}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          animate={{ rotate: isCollapsed ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden bg-white"
          >
            <div className="px-4 py-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollapsibleSection; 