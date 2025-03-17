'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Collapsible component for progressive disclosure
const Collapsible = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border bg-white rounded-lg shadow-sm overflow-hidden mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-3 px-4 bg-gradient-to-r from-[#EFF6FF] to-white hover:from-[#DBEAFE] focus:outline-none transition-colors duration-200"
      >
        <div className="font-semibold text-[#1F2937] flex items-center">
          {/* Add a small indicator dot */}
          <motion.div 
            animate={{ 
              backgroundColor: isOpen ? '#3B82F6' : '#D1D5DB',
              scale: isOpen ? 1 : 0.8
            }}
            className="w-2 h-2 rounded-full mr-2"
          />
          {title}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[#EFF6FF] rounded-full p-1"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 text-[#3B82F6]"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: 'auto', 
              opacity: 1,
              transition: {
                height: { duration: 0.3 },
                opacity: { duration: 0.3, delay: 0.1 }
              }
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              transition: {
                height: { duration: 0.3 },
                opacity: { duration: 0.2 }
              }
            }}
            className="overflow-hidden bg-white"
          >
            <div className="p-4 collapsible-content">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Collapsible; 