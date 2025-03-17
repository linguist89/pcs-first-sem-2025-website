'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// Import utility functions
import { extractSections, preprocessMarkdown } from './utils/markdownUtils';

// Import components
import CustomStyle from './CustomStyle';
import ContentRenderer from './ContentRenderer';
import SidebarContent from './SidebarContent';
import Collapsible from './Collapsible';
import MarkdownRenderer from './MarkdownRenderer';

const DifficultyBadge = ({ level }) => {
  const colors = {
    'Beginner': {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200'
    },
    'Intermediate': {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-200'
    },
    'Advanced': {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200'
    }
  };
  
  const style = colors[level] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
  
  return (
    <span className={`${style.bg} ${style.text} ${style.border} rounded-full px-3 py-1 text-sm font-medium border`}>
      {level}
    </span>
  );
};

const LessonDetail = ({ lessonId }) => {
  // If no lessonId is provided, return early without rendering or fetching
  if (!lessonId) {
    return null;
  }

  const [lesson, setLesson] = useState(null);
  const [content, setContent] = useState('');
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const contentRef = useRef(null);
  
  useEffect(() => {
    if (lessonId) {
      fetchLesson();
    }
  }, [lessonId]);
  
  const fetchLesson = async () => {
    setIsLoading(true);
    try {
      // Fetch the markdown file for the lesson
      const response = await fetch(`/api/lessons/${lessonId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Failed to fetch lesson');
      }
      
      const data = await response.json();
      
      // Check if we got a valid lesson
      if (!data.lesson) {
        throw new Error('Invalid lesson data received');
      }
      
      setLesson(data.lesson);
      
      // Preprocess markdown for better rendering
      const processedMarkdown = preprocessMarkdown(data.content);
      setContent(processedMarkdown);
      
      // Extract sections from the markdown
      const extractedSections = extractSections(processedMarkdown);
      setSections(extractedSections);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching lesson:', error);
      setIsLoading(false);
    }
  };
  
  const scrollToSection = (index) => {
    setActiveIndex(index);
    const section = sections[index];
    
    if (section && contentRef.current) {
      const element = contentRef.current.querySelector(`#${section.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };
  
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-bg-secondary rounded w-3/4 mb-6"></div>
          <div className="h-4 bg-bg-secondary rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-bg-secondary rounded w-2/3 mb-4"></div>
          <div className="h-64 bg-bg-secondary rounded mb-6"></div>
          <div className="h-4 bg-bg-secondary rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-bg-secondary rounded w-1/2 mb-4"></div>
        </div>
      </div>
    );
  }
  
  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Lesson Not Found</h1>
        <p className="mb-6">The lesson you're looking for could not be found.</p>
        <Link href="/lessons" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors">
          Back to Lessons
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Mobile navigation toggle */}
      <button
        onClick={toggleSidebar}
        className="fixed bottom-6 right-6 z-30 p-3 bg-primary text-white rounded-full shadow-lg md:hidden hover:bg-primary-dark transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {showSidebar ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
  
      {/* Mobile Sidebar (hidden on medium screens and above) */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 md:hidden ${
          showSidebar ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      ></div>
  
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-30 shadow-xl transform transition-transform duration-300 ease-in-out md:hidden ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold text-primary">Lesson {lessonId}</h2>
          <h3 className="text-gray-600">{lesson.title}</h3>
        </div>
        <SidebarContent sections={sections} activeIndex={activeIndex} onSectionClick={scrollToSection} />
      </div>
  
      {/* Main content area */}
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto">
        {/* Desktop sidebar (hidden on small screens) */}
        <div className="hidden md:block md:w-1/4 lg:w-1/5 h-screen sticky top-0 p-4 bg-white border-r">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-primary">Lesson {lessonId}</h2>
            <h3 className="text-gray-600">{lesson.title}</h3>
          </div>
          <SidebarContent sections={sections} activeIndex={activeIndex} onSectionClick={scrollToSection} />
        </div>
  
        {/* Main lesson content */}
        <main 
          ref={contentRef} 
          className="flex-1 p-4 md:p-8 overflow-auto"
        >
          <div className="prose prose-lg max-w-none mb-12">
            <header className="mb-8">
              <div className="mb-2 text-gray-500 flex items-center">
                <span className="mr-2">Lesson {lessonId}</span>
                {lesson.difficulty && <DifficultyBadge level={lesson.difficulty} />}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-text-primary">{lesson.title}</h1>
              {lesson.description && (
                <p className="text-lg text-text-secondary">{lesson.description}</p>
              )}
            </header>

            {/* Render the lesson content */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <MarkdownRenderer content={content} />
            </div>

            {/* Navigation links */}
            <div className="flex flex-col sm:flex-row justify-between mt-12 space-y-4 sm:space-y-0">
              {lesson.prevLesson && (
                <Link 
                  href={`/lessons/${lesson.prevLesson}`}
                  className="bg-white border border-primary text-primary px-6 py-3 rounded-md hover:bg-primary hover:text-white transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous Lesson
                </Link>
              )}
              
              {lesson.nextLesson && (
                <Link 
                  href={`/lessons/${lesson.nextLesson}`}
                  className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition-colors flex items-center"
                >
                  Next Lesson
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LessonDetail; 