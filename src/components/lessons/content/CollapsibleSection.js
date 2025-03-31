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
      border: 'border-green-400 dark:border-green-600',
      background: 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20',
      text: 'text-green-800 dark:text-green-300',
      icon: 'text-green-600 dark:text-green-400',
      hover: 'hover:bg-green-100 dark:hover:bg-green-800/30',
    },
    lesson: {
      border: 'border-blue-400 dark:border-blue-600',
      background: 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20',
      text: 'text-blue-800 dark:text-blue-300',
      icon: 'text-blue-600 dark:text-blue-400',
      hover: 'hover:bg-blue-100 dark:hover:bg-blue-800/30',
    },
    exercise: {
      border: 'border-yellow-400 dark:border-yellow-600',
      background: 'bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/20',
      text: 'text-yellow-800 dark:text-yellow-300',
      icon: 'text-yellow-600 dark:text-yellow-400',
      hover: 'hover:bg-yellow-100 dark:hover:bg-yellow-800/30',
    },
    postlesson: {
      border: 'border-purple-400 dark:border-purple-600',
      background: 'bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20',
      text: 'text-purple-800 dark:text-purple-300',
      icon: 'text-purple-600 dark:text-purple-400',
      hover: 'hover:bg-purple-100 dark:hover:bg-purple-800/30',
    },
    default: {
      border: 'border-gray-400 dark:border-gray-600',
      background: 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900',
      text: 'text-gray-800 dark:text-gray-300',
      icon: 'text-gray-600 dark:text-gray-400',
      hover: 'hover:bg-gray-100 dark:hover:bg-gray-700',
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
            className="overflow-hidden bg-[var(--card-bg)]"
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