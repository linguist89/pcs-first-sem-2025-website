'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TextBlock,
  CodeBlock,
  Exercise,
  Scenario,
  MediaBlock,
  Quiz,
  CodeSlider
} from './content';
import InteractiveCode from './content/InteractiveCode';
import CollapsibleSection from './content/CollapsibleSection';
import { useUser } from '@/context/UserContext';
import ClassWarmup from './content/ClassWarmup';

// Helper function to render individual content items
const renderContentItem = (section, index, isAdmin) => {
  const { type, ...props } = section;
  
  switch (type) {
    case 'text':
      return <TextBlock key={index} {...props} />;
      
    case 'code':
      return <CodeBlock key={index} {...props} />;
      
    case 'interactiveCode':
      return <InteractiveCode key={index} {...props} />;
      
    case 'exercise':
      return <Exercise key={index} {...props} isAdmin={isAdmin} />;
      
    case 'challenge':
      return <Exercise key={index} {...props} isAdmin={isAdmin} isChallenge={true} />;
      
    case 'scenario':
      return <Scenario key={index} {...props} />;
      
    case 'media':
      return <MediaBlock key={index} {...props} />;
      
    case 'quiz':
      return <Quiz key={index} {...props} />;
      
    case 'codeSlider':
      return <CodeSlider key={index} {...props} />;
      
    case 'classWarmup':
      return <ClassWarmup key={index} />;
      
    default:
      return (
        <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-6">
          <p className="text-yellow-700">
            Unknown content type: {type}
          </p>
        </div>
      );
  }
};

// Function to determine which section a content item belongs to
const determineSectionType = (section, index, content) => {
  const { type, title, caption, language, content: contentText } = section;
  
  // Special case for classWarmup type
  if (type === 'classWarmup') {
    return 'warmup';
  }
  
  // First, pre-process content to identify sequential warmup code blocks
  const isWarmupSequence = () => {
    // Check for previous warmup sections
    let foundWarmupHeader = false;
    let sequentialCodeBlocks = true;
    
    // Look backwards to find a warmup header
    for (let i = index - 1; i >= 0; i--) {
      const prevItem = content[i];
      
      // If we find a warmup header, mark it
      if (prevItem.type === 'text' && 
          prevItem.title && (
            prevItem.title.toLowerCase().includes('warm') || 
            prevItem.title.toLowerCase().includes('warmup') || 
            prevItem.title.toLowerCase().includes('warm-up') ||
            prevItem.title.toLowerCase().includes('prerequisites')
          )) {
        foundWarmupHeader = true;
        break;
      }
      
      // If we encounter a non-code block or a different section header before finding a warmup header,
      // this breaks the sequential code blocks pattern
      if (prevItem.type !== 'code') {
        if (prevItem.type === 'text' && prevItem.title) {
          // We hit a different section header
          break;
        }
        // If it's not a code block or a section header, continue checking
        if (prevItem.type !== 'text' || !(prevItem.content && !prevItem.title)) {
          sequentialCodeBlocks = false;
          break;
        }
      }
    }
    
    // If there's a warmup header and we're in a sequence of code blocks
    if (foundWarmupHeader && (type === 'code' || (type === 'text' && !title))) {
      return true;
    }
    
    return false;
  };
  
  // Check for explicit warmup blocks
  if (
    title?.toLowerCase().includes('warm') || 
    title?.toLowerCase().includes('warmup') ||
    title?.toLowerCase().includes('warm-up') ||
    title?.toLowerCase().includes('prerequisites') ||
    caption?.toLowerCase().includes('warm') ||
    (type === 'code' && language === 'bash' && 
      (contentText?.includes('wget') || 
       contentText?.includes('curl') || 
       contentText?.includes('download')))
  ) {
    return 'warmup';
  }
  
  // Check for sequential warmup code blocks
  if (isWarmupSequence()) {
    return 'warmup';
  }
  
  // Check for previous item context (simpler cases)
  const prevItem = index > 0 ? content[index - 1] : null;
  
  // If this is a code block that follows a warmup title, it should be part of warmup
  if (prevItem && 
      type === 'code' && 
      prevItem.type === 'text' &&
      prevItem.title && 
      (prevItem.title.toLowerCase().includes('warm') || 
       prevItem.title.toLowerCase().includes('prerequisites'))) {
    return 'warmup';
  }
  
  // Exercise section detection
  if (
    type === 'exercise' ||
    title?.toLowerCase().includes('exercise') ||
    title?.toLowerCase().includes('task') ||
    title?.toLowerCase().includes('challenge')
  ) {
    return 'exercise';
  }
  
  // Post-lesson section detection
  if (
    type === 'quiz' ||
    title?.toLowerCase().includes('quiz') ||
    title?.toLowerCase().includes('summary') ||
    title?.toLowerCase().includes('conclusion') ||
    title?.toLowerCase().includes('further reading') ||
    title?.toLowerCase().includes('homework')
  ) {
    return 'postlesson';
  }
  
  // Default to lesson section
  return 'lesson';
};

const LessonRenderer = ({ content = [], expandedSections = {} }) => {
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check if current user is an admin/instructor
  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'instructor')) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);
  
  if (!content || content.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No content available for this lesson.
      </div>
    );
  }
  
  // Group content by section type
  const groupedContent = content.reduce((acc, section, index) => {
    const sectionType = determineSectionType(section, index, content);
    if (!acc[sectionType]) {
      acc[sectionType] = [];
    }
    acc[sectionType].push(section);
    return acc;
  }, {});
  
  // Section titles and icons
  const sectionConfig = {
    warmup: { 
      title: "Warm-up", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      ) 
    },
    lesson: { 
      title: "Lesson Content", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ) 
    },
    exercise: { 
      title: "Exercises", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ) 
    },
    postlesson: { 
      title: "Post-Lesson", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ) 
    }
  };
  
  // Order of sections to display
  const sectionOrder = ['warmup', 'lesson', 'exercise', 'postlesson'];
  
  return (
    <div className="lesson-content">
      {sectionOrder.map(sectionType => {
        const sectionItems = groupedContent[sectionType];
        if (!sectionItems || sectionItems.length === 0) {
          return null;
        }
        
        return (
          <motion.div
            key={sectionType}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CollapsibleSection 
              title={sectionConfig[sectionType].title}
              type={sectionType}
              icon={sectionConfig[sectionType].icon}
              defaultCollapsed={!expandedSections[sectionType]}
            >
              <div className="space-y-4">
                {sectionItems.map((item, idx) => {
                  // Find the index in the original content array
                  const originalIndex = content.findIndex(section => section === item);
                  return (
                    <div key={idx} id={`section-${originalIndex}`}>
                      {renderContentItem(item, idx, isAdmin)}
                    </div>
                  );
                })}
              </div>
            </CollapsibleSection>
          </motion.div>
        );
      })}
    </div>
  );
};

export default LessonRenderer; 