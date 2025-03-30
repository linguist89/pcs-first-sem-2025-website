'use client';

import { motion } from 'framer-motion';

// Define section config for icons and types
const sectionConfig = {
  warmup: {
    title: 'Warm-up',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  lesson: {
    title: 'Lesson Content',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
  exercise: {
    title: 'Exercises',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    )
  },
  postlesson: {
    title: 'Review',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
};

// Section order for display
const sectionOrder = ['warmup', 'lesson', 'exercise', 'postlesson'];

// Table of contents sidebar component
export const TableOfContentsSidebar = ({ content, onSectionClick, isOpen, toggleSidebar }) => {
  if (!content || content.length === 0) return null;
  
  // Group content items by section type
  const groupedSections = {
    warmup: [],
    lesson: [],
    exercise: [],
    postlesson: []
  };
  
  content.forEach((section, index) => {
    if (!section.title) return; // Only include titled sections
    
    // Determine section type from the section
    let sectionType = section.type || 'lesson';
    
    // Map content types to our standard section types
    if (section.type === 'warmup' || 
        (section.title && section.title.toLowerCase().includes('warm-up')) ||
        (section.title && section.title.toLowerCase().includes('setup'))) {
      sectionType = 'warmup';
    } else if (section.type === 'exercise' || 
               (section.title && section.title.toLowerCase().includes('exercise'))) {
      sectionType = 'exercise';
    } else if (section.type === 'postlesson' || 
               section.type === 'quiz' ||
               (section.title && section.title.toLowerCase().includes('knowledge check')) ||
               (section.title && section.title.toLowerCase().includes('quiz'))) {
      sectionType = 'postlesson';
    } else if (section.type === 'scenario' ||
               (section.title && section.title.toLowerCase().includes('analyzing'))) {
      sectionType = 'lesson';
    }
    
    // Add to the appropriate group
    if (groupedSections[sectionType]) {
      groupedSections[sectionType].push({ ...section, index });
    } else {
      // Default to lesson if type is unknown
      groupedSections['lesson'].push({ ...section, index });
    }
  });
  
  return (
    <motion.div 
      className={`fixed top-16 bottom-0 left-0 bg-white border-r border-gray-200 shadow-lg z-30 overflow-y-auto overflow-x-hidden transition-all duration-300`}
      initial={{ width: isOpen ? "280px" : "40px" }}
      animate={{ width: isOpen ? "280px" : "40px" }}
      transition={{ duration: 0.3 }}
      style={{ opacity: 1 }}
    >
      {/* Collapsed state - vertical tab indicator */}
      <div 
        onClick={toggleSidebar}
        className={`h-full w-full flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative ${isOpen ? 'hidden' : 'flex'}`}
        title="Open contents"
      >
        {/* Right edge arrow indicator */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
          <div className="h-8 w-3 bg-blue-500 rounded-l-sm flex items-center justify-center animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        
        {/* Vertical text "CONTENTS" */}
        <div className="flex h-full w-full items-center justify-center">
          <div className="transform rotate-90 origin-center whitespace-nowrap">
            <span className="text-xs tracking-widest font-semibold text-gray-600">CONTENTS</span>
          </div>
        </div>
      </div>
      
      {/* Expanded state - full sidebar content */}
      <div className={`p-4 min-w-[280px] ${isOpen ? 'block' : 'hidden'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Contents</h2>
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Close sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <ul className="space-y-3">
          {sectionOrder.map(sectionType => {
            const sections = groupedSections[sectionType];
            if (sections.length === 0) return null;
            
            return (
              <li key={sectionType} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                <div className="flex items-center font-medium text-gray-700 mb-2">
                  <span className="mr-2 text-gray-500">{sectionConfig[sectionType].icon}</span>
                  {sectionConfig[sectionType].title}
                </div>
                <ul className="ml-3 space-y-1.5">
                  {sections.map((item, i) => (
                    <li key={i}>
                      <button
                        onClick={() => onSectionClick(item.index)}
                        className="py-1 px-2 w-full text-left text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        {item.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.div>
  );
};

export default TableOfContentsSidebar; 