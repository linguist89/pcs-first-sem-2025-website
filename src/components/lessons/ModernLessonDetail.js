'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import LessonRenderer from './LessonRenderer';
import { usePathname } from 'next/navigation';

// Helper function to determine section type
const determineSectionType = (section, index, allContent) => {
  const { type, title, caption, language, content: contentText } = section;
  
  // First, pre-process content to identify sequential warmup code blocks
  const isWarmupSequence = () => {
    // Check for previous warmup sections
    let foundWarmupHeader = false;
    let sequentialCodeBlocks = true;
    
    // Look backwards to find a warmup header
    for (let i = index - 1; i >= 0; i--) {
      const prevItem = allContent[i];
      
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
  const prevItem = index > 0 ? allContent[index - 1] : null;
  
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

// Table of contents sidebar component
const TableOfContentsSidebar = ({ content, onSectionClick, isOpen, toggleSidebar }) => {
  if (!content || content.length === 0) return null;
  
  // Group content into sections for TOC
  const groupedSections = {
    warmup: [],
    lesson: [],
    exercise: [],
    postlesson: []
  };
  
  // Group content items by section type using direct mapping
  content.forEach((section, index) => {
    if (!section.title) return; // Only include titled sections
    
    let sectionType = 'lesson'; // default
      
    // Check for warmup
    if (section.title?.toLowerCase().includes('warm') || 
        section.title?.toLowerCase().includes('prerequisite') ||
        section.type === 'code' && section.caption?.toLowerCase().includes('warm') ||
        section.type === 'code' && section.language === 'bash' && 
        (section.content?.includes('wget') || section.content?.includes('curl'))) {
      sectionType = 'warmup';
    }
    // Check for exercise
    else if (section.type === 'exercise' || 
             section.title?.toLowerCase().includes('exercise') ||
             section.title?.toLowerCase().includes('task')) {
      sectionType = 'exercise';
    }
    // Check for post-lesson
    else if (section.type === 'quiz' || 
             section.title?.toLowerCase().includes('quiz') ||
             section.title?.toLowerCase().includes('summary')) {
      sectionType = 'postlesson';
    }
    
    groupedSections[sectionType].push({ ...section, index });
  });
  
  // Section titles for TOC
  const sectionTitles = {
    warmup: 'Warm-up',
    lesson: 'Lesson Content',
    exercise: 'Exercises',
    postlesson: 'Post-Lesson'
  };
  
  // Section icons
  const sectionIcons = {
    warmup: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
      </svg>
    ),
    lesson: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    exercise: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    postlesson: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )
  };
  
  // Order of sections to display
  const sectionOrder = ['warmup', 'lesson', 'exercise', 'postlesson'];
  
  return (
    <motion.div 
      className={`fixed top-16 bottom-0 left-0 bg-[var(--card-bg)] border-r border-[var(--card-border)] shadow-lg z-30 overflow-y-auto overflow-x-hidden transition-all duration-300`}
      initial={{ width: isOpen ? "280px" : "40px" }}
      animate={{ width: isOpen ? "280px" : "40px" }}
      transition={{ duration: 0.3 }}
      style={{ opacity: 1 }} // Always visible
    >
      {/* Collapsed state - vertical tab indicator - use display property instead of conditional rendering */}
      <div 
        onClick={toggleSidebar}
        className={`h-full w-full flex flex-col items-center justify-center cursor-pointer bg-[var(--background-secondary)] hover:bg-[var(--background-accent)] transition-colors relative ${isOpen ? 'hidden' : 'flex'}`}
        title="Open contents"
      >
        {/* Right edge arrow indicator */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
          <div className="h-8 w-3 bg-[var(--primary-color)] rounded-l-sm flex items-center justify-center animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        
        {/* Vertical text "CONTENTS" */}
        <div className="flex h-full w-full items-center justify-center">
          <div className="transform rotate-90 origin-center whitespace-nowrap">
            <span className="text-xs tracking-widest font-semibold text-[var(--text-secondary)]">CONTENTS</span>
          </div>
        </div>
      </div>
      
      {/* Expanded state - full sidebar content - use display property instead of conditional rendering */}
      <div className={`p-4 min-w-[280px] ${isOpen ? 'block' : 'hidden'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Contents</h2>
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-[var(--background-secondary)]"
            aria-label="Close sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <ul className="space-y-3">
          {sectionOrder.map(sectionType => {
            const sections = groupedSections[sectionType];
            if (sections.length === 0) return null;
            
            return (
              <li key={sectionType} className="border-b border-[var(--border-light)] pb-2 last:border-0 last:pb-0">
                <div className="flex items-center font-medium text-[var(--text-primary)] mb-2">
                  <span className="mr-2 text-[var(--text-secondary)]">{sectionIcons[sectionType]}</span>
                  {sectionTitles[sectionType]}
                </div>
                <ul className="pl-6 space-y-1.5">
                  {sections.map(section => (
                    <li key={section.index}>
                      <button
                        onClick={() => {
                          onSectionClick(section.index);
                          if (window.innerWidth < 768) {
                            toggleSidebar();
                          }
                        }}
                        className="text-left text-sm w-full px-2 py-1 rounded hover:bg-[var(--background-secondary)] text-[var(--text-secondary)] truncate max-w-full block"
                      >
                        {section.title}
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

const ModernLessonDetail = ({ lessonId }) => {
  const [lesson, setLesson] = useState(null);
  const [content, setContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    if (lessonId) {
      fetchLesson();
    }
  }, [lessonId]);

  // Close sidebar on ESC key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen]);
  
  const fetchLesson = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/lessons/${lessonId}`);
      
      // Using clone() to create a copy of the response that can be read multiple times
      const responseForError = response.clone();
      
      if (!response.ok) {
        let errorMessage = 'Failed to fetch lesson';
        try {
          const errorData = await responseForError.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      if (!data.lesson) {
        throw new Error('Invalid lesson data received');
      }
      
      setLesson(data.lesson);
      
      // Handle different formats
      if (data.lesson.format === 'json' || data.lesson.format === 'modular') {
        // For JSON format, content is already structured
        setContent(data.content || []);
      } else {
        // For markdown format, we'd need to convert content to structured format
        // For now, we'll just show a message about format conversion
        setContent([
          {
            type: 'text',
            title: 'Legacy Lesson Format',
            content: 'This lesson is in the legacy markdown format. Please view it in the traditional lesson viewer or convert it to the new JSON format.'
          }
        ]);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching lesson:', error);
      setError(error.message);
      setIsLoading(false);
    }
  };
  
  const handleSectionClick = (index) => {
    // Find the clicked section and its type
    const clickedSection = content.find((_, i) => i === index);
    if (clickedSection) {
      // Use a direct mapping approach instead of calling determineSectionType
      let sectionType = 'lesson'; // default
      
      // Check for warmup
      if (clickedSection.title?.toLowerCase().includes('warm') || 
          clickedSection.title?.toLowerCase().includes('prerequisite') ||
          clickedSection.type === 'code' && clickedSection.caption?.toLowerCase().includes('warm') ||
          clickedSection.type === 'code' && clickedSection.language === 'bash' && 
          (clickedSection.content?.includes('wget') || clickedSection.content?.includes('curl'))) {
        sectionType = 'warmup';
      }
      // Check for exercise
      else if (clickedSection.type === 'exercise' || 
               clickedSection.title?.toLowerCase().includes('exercise') ||
               clickedSection.title?.toLowerCase().includes('task')) {
        sectionType = 'exercise';
      }
      // Check for post-lesson
      else if (clickedSection.type === 'quiz' || 
               clickedSection.title?.toLowerCase().includes('quiz') ||
               clickedSection.title?.toLowerCase().includes('summary')) {
        sectionType = 'postlesson';
      }
      
      // Set this section type to be expanded
      setExpandedSections(prev => ({
        ...prev,
        [sectionType]: true
      }));
      
      // Add a small delay to ensure the section expands before scrolling
      setTimeout(() => {
        // Scroll to section
        document.getElementById(`section-${index}`)?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 150);
    }
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const navigateToLesson = (lessonId) => {
    if (!lessonId) return;
    
    // Extract the base path without the current lesson ID
    const basePath = pathname.replace(/\/lessons\/\d+$/, '/lessons');
    router.push(`${basePath}/${lessonId}`);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-color)]"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-300 p-4 rounded-lg">
        <h3 className="text-lg font-bold mb-2">Error</h3>
        <p>{error}</p>
        <Link href="/lessons" className="mt-4 inline-block text-[var(--primary-color)] hover:underline">
          Return to Lessons
        </Link>
      </div>
    );
  }
  
  if (!lesson) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-300 p-4 rounded-lg">
        <h3 className="text-lg font-bold mb-2">Lesson Not Found</h3>
        <p>The requested lesson could not be found.</p>
        <Link href="/lessons" className="mt-4 inline-block text-[var(--primary-color)] hover:underline">
          Return to Lessons
        </Link>
      </div>
    );
  }
  
  return (
    <>
      {/* Sidebar */}
      <TableOfContentsSidebar 
        content={content} 
        onSectionClick={handleSectionClick}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
      
      {/* Main content area - always in the same position */}
      <div className="px-4 sm:px-6 md:px-8">
        <div className="max-w-4xl mx-auto relative">
          {/* Lesson header */}
          <header className="mb-8">
            <div className="flex flex-wrap justify-between items-center mb-4">
              <div className="mb-2 md:mb-0">
                <span className="text-sm font-medium text-[var(--text-secondary)]">Lesson {lessonId}</span>
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">{lesson.title}</h1>
              </div>
            </div>
            
            {/* Description */}
            {lesson.description && (
              <p className="text-[var(--text-secondary)] mb-4">{lesson.description}</p>
            )}
            
            {/* Topics */}
            {lesson.topics && lesson.topics.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {lesson.topics.map((topic, index) => (
                    <span key={index} className="bg-[var(--background-secondary)] text-[var(--text-primary)] text-xs px-2 py-1 rounded">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </header>
          
          {/* Lesson content */}
          <div className="bg-[var(--card-bg)] rounded-lg shadow-md p-6 mb-8 border border-[var(--card-border)]">
            <LessonRenderer 
              content={content}
              expandedSections={expandedSections}
            />
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-between mb-8">
            <button
              onClick={() => navigateToLesson(lesson.prevLesson)}
              disabled={!lesson.prevLesson}
              className={`px-4 py-2 rounded-md flex items-center ${
                lesson.prevLesson 
                  ? 'bg-[var(--background-secondary)] text-[var(--text-primary)] hover:bg-[var(--background-accent)]' 
                  : 'bg-[var(--background-secondary)] text-[var(--text-secondary)] opacity-50 cursor-not-allowed'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous Lesson
            </button>
            
            <button
              onClick={() => navigateToLesson(lesson.nextLesson)}
              disabled={!lesson.nextLesson}
              className={`px-4 py-2 rounded-md flex items-center ${
                lesson.nextLesson 
                  ? 'bg-[var(--primary-color)] text-white hover:bg-[color-mix(in_srgb,var(--primary-color),black_10%)]' 
                  : 'bg-[var(--background-secondary)] text-[var(--text-secondary)] opacity-50 cursor-not-allowed'
              }`}
            >
              Next Lesson
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModernLessonDetail; 