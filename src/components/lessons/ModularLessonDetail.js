'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import {
  LessonSection,
  LessonModule,
  groupContentBySection,
  sectionConfig,
  sectionOrder
} from './ContentModules';

// Table of contents sidebar component
const TableOfContentsSidebar = ({ content, onSectionClick, isOpen, toggleSidebar }) => {
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
    
    // Use the already determined sectionType from the section
    const sectionType = section.sectionType || 'lesson';
    groupedSections[sectionType].push({ ...section, index });
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

const ModularLessonDetail = ({ lessonId }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check if current user is an admin/instructor
  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'instructor')) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);
  
  // Handle keyboard shortcuts for navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Only handle shortcuts if not in an input or textarea
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
      
      // ALT+, for previous lesson
      if (event.altKey && event.key === ',') {
        if (lesson?.prevLesson) {
          navigateToLesson(lesson.prevLesson);
        }
      }
      // ALT+. for next lesson
      else if (event.altKey && event.key === '.') {
        if (lesson?.nextLesson) {
          navigateToLesson(lesson.nextLesson);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lesson]);
  
  // Fetch lesson data
  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/lessons/${lessonId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch lesson: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Process sections to add their section type
        if (data.content) {
          data.content = data.content.map((section, index) => ({
            ...section,
            sectionType: determineSectionType(section, index, data.content)
          }));
        }
        
        setLesson(data);
      } catch (err) {
        console.error('Error fetching lesson:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLesson();
  }, [lessonId]);
  
  // Handle section click in table of contents
  const handleSectionClick = (index) => {
    const section = document.getElementById(`section-${index}`);
    if (section) {
      // Calculate position to scroll to (accounting for sticky header)
      const headerOffset = 80;
      const sectionPosition = section.getBoundingClientRect().top;
      const offsetPosition = sectionPosition + window.pageYOffset - headerOffset;
      
      // Scroll to the section
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // If on mobile, close the sidebar after clicking
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    }
  };
  
  // Toggle sidebar open/closed
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Navigate to another lesson
  const navigateToLesson = (lessonId) => {
    router.push(`/lessons/${lessonId}`);
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 pt-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">Error loading lesson</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  if (!lesson) {
    return (
      <div className="container mx-auto px-4 pt-8">
        <div className="text-center text-gray-500">
          <p>Lesson not found</p>
        </div>
      </div>
    );
  }
  
  // Group content by section type
  const groupedContent = groupContentBySection(lesson.content || []);
  
  return (
    <>
      {/* Table of contents sidebar */}
      <TableOfContentsSidebar
        content={lesson.content || []}
        onSectionClick={handleSectionClick}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      
      <div className={`pt-16 transition-all duration-300 ${sidebarOpen ? 'md:ml-[280px]' : 'md:ml-[40px]'}`}>
        {/* Lesson header */}
        <div className="bg-white border-b shadow-sm sticky top-16 z-20">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div>
                {lesson.difficulty && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-2">
                    {lesson.difficulty}
                  </span>
                )}
                {lesson.duration && (
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mb-2">
                    {lesson.duration}
                  </span>
                )}
                <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
                {lesson.description && (
                  <p className="text-gray-600 mt-2">{lesson.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Lesson navigation (prev/next) */}
        <div className="bg-gray-50 border-b">
          <div className="container mx-auto px-4 py-2">
            <div className="flex justify-between">
              <div>
                {lesson.prevLesson && (
                  <Link href={`/lessons/${lesson.prevLesson}`} className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous Lesson
                  </Link>
                )}
              </div>
              <div>
                {lesson.nextLesson && (
                  <Link href={`/lessons/${lesson.nextLesson}`} className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                    Next Lesson
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Lesson content */}
        <div className="container mx-auto px-4 py-8">
          {/* Render grouped content by section type */}
          {sectionOrder.map(sectionType => {
            const sections = groupedContent[sectionType];
            if (!sections || sections.length === 0) return null;
            
            return (
              <LessonSection 
                key={sectionType}
                title={sectionConfig[sectionType].title}
                icon={sectionConfig[sectionType].icon}
                type={sectionType}
                isCollapsible={true}
                defaultExpanded={true}
              >
                <div className="space-y-8">
                  {sections.map((section) => (
                    <div 
                      key={`section-${section.index}`}
                      id={`section-${section.index}`}
                      className="scroll-mt-24" // Adjust scroll margin for sticky header
                    >
                      <LessonModule 
                        {...section} 
                        isAdmin={isAdmin}
                      />
                    </div>
                  ))}
                </div>
              </LessonSection>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ModularLessonDetail;

// Helper function to determine section type
const determineSectionType = (section, index, content) => {
  const { type, title, caption, language, content: contentText } = section;
  
  // Check for explicit warmup blocks
  if (
    title?.toLowerCase().includes('warm') || 
    title?.toLowerCase().includes('warmup') ||
    title?.toLowerCase().includes('warm-up') ||
    title?.toLowerCase().includes('prerequisites') ||
    caption?.toLowerCase().includes('warm')
  ) {
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
    title?.toLowerCase().includes('conclusion')
  ) {
    return 'postlesson';
  }
  
  // Default to lesson section
  return 'lesson';
}; 