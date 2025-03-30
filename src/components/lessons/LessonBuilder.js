'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * LessonHeader component for displaying lesson title, description, and metadata
 */
const LessonHeader = ({ title, description, difficulty, duration }) => {
  return (
    <div className="bg-white border-b shadow-sm sticky top-16 z-20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div>
            {difficulty && (
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-2">
                {difficulty}
              </span>
            )}
            {duration && (
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mb-2">
                {duration}
              </span>
            )}
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {description && (
              <p className="text-gray-600 mt-2">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * LessonNavigationBar component for previous/next lesson links
 */
const LessonNavigationBar = ({ prevLesson, nextLesson, onNavigate }) => {
  return (
    <div className="bg-gray-50 border-b">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between">
          <div>
            {prevLesson && (
              <button 
                onClick={() => onNavigate(prevLesson)}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous Lesson
              </button>
            )}
          </div>
          <div>
            {nextLesson && (
              <button 
                onClick={() => onNavigate(nextLesson)}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                Next Lesson
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * LessonSection component for grouping related content
 */
const LessonSection = ({ 
  title, 
  icon, 
  type = 'lesson', 
  children,
  isCollapsible = true,
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Different styling based on section type
  const sectionStyles = {
    warmup: 'bg-blue-50 border-blue-200',
    lesson: 'bg-white border-gray-200',
    exercise: 'bg-green-50 border-green-200',
    postlesson: 'bg-purple-50 border-purple-200'
  };

  return (
    <div className={`mb-8 border rounded-lg overflow-hidden ${sectionStyles[type] || sectionStyles.lesson}`}>
      {title && (
        <div 
          className={`px-6 py-4 border-b border-gray-200 flex justify-between items-center ${isCollapsible ? 'cursor-pointer' : ''}`}
          onClick={isCollapsible ? () => setIsExpanded(!isExpanded) : undefined}
        >
          <div className="flex items-center">
            {icon && <span className="mr-2 text-gray-500">{icon}</span>}
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          </div>
          {isCollapsible && (
            <button className="text-gray-500 hover:text-gray-700">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>
      )}
      {(!isCollapsible || isExpanded) && (
        <div className="p-6">
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * Main LessonBuilder component
 * Use this component to build custom lessons with direct content component usage
 */
const LessonBuilder = ({ 
  title,
  description,
  difficulty,
  duration,
  prevLesson,
  nextLesson,
  onNavigate,
  sections,
  children
}) => {
  return (
    <div className="lesson-builder">
      <LessonHeader 
        title={title}
        description={description}
        difficulty={difficulty}
        duration={duration}
      />
      
      <LessonNavigationBar 
        prevLesson={prevLesson}
        nextLesson={nextLesson}
        onNavigate={onNavigate}
      />
      
      <div className="container mx-auto px-4 py-8">
        {sections ? (
          // Render provided section data
          sections.map((section, index) => (
            <LessonSection
              key={index}
              title={section.title}
              icon={section.icon}
              type={section.type}
              isCollapsible={section.isCollapsible}
              defaultExpanded={section.defaultExpanded}
            >
              {section.content}
            </LessonSection>
          ))
        ) : (
          // Or use direct children for more flexibility
          children
        )}
      </div>
    </div>
  );
};

export { LessonBuilder, LessonHeader, LessonNavigationBar, LessonSection };
export default LessonBuilder; 