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

const LessonDetail = ({ lessonId }) => {
  const [lesson, setLesson] = useState(null);
  const [content, setContent] = useState('');
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const contentRef = useRef(null);
  
  useEffect(() => {
    fetchLesson();
  }, [lessonId]);
  
  const fetchLesson = async () => {
    setIsLoading(true);
    try {
      // Fetch the markdown file for the lesson
      const response = await fetch(`/api/lessons/${lessonId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch lesson');
      }
      
      const data = await response.json();
      
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
  
  return (
    <div className="max-w-6xl mx-auto">
      <CustomStyle />
      
      {/* Mobile Header (fixed at top) */}
      <div className="sticky top-0 z-10 lg:hidden bg-bg-primary border-b border-border-light p-4">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => setShowSidebar(true)}
            className="p-2 -ml-2 text-text-secondary hover:text-primary transition-colors"
            aria-label="Show sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="text-text-primary font-semibold truncate">
            {lesson?.title}
          </div>
          
          <button 
            onClick={() => setShowMetadata(!showMetadata)}
            className="p-2 -mr-2 text-text-secondary hover:text-primary transition-colors"
            aria-label="Toggle lesson info"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
        
        {/* Mobile metadata panel (slides down when toggled) */}
        <div className={`overflow-hidden transition-all duration-300 ${showMetadata ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
          {lesson && (
            <div className="p-4 bg-bg-secondary rounded-lg">
              <h1 className="font-bold text-text-primary text-xl mb-2">{lesson.title}</h1>
              <div className="text-sm text-text-secondary mb-2">{lesson.description}</div>
              
              <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary mt-3">
                <div>
                  <div className="font-semibold">Difficulty</div>
                  <div>{lesson.difficulty}</div>
                </div>
                <div>
                  <div className="font-semibold">Est. Time</div>
                  <div>{lesson.duration}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile sidebar (slides in from left) */}
      <div 
        className={`fixed inset-0 z-20 lg:hidden transition-opacity duration-300 ${
          showSidebar ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className="absolute inset-0 bg-bg-primary bg-opacity-80"
          onClick={() => setShowSidebar(false)}
        ></div>
        
        <div 
          className={`absolute left-0 top-0 bottom-0 w-72 bg-bg-primary shadow-xl transition-transform duration-300 transform ${
            showSidebar ? 'translate-x-0' : '-translate-x-full'
          } p-4 overflow-y-auto z-30`}
        >
          <SidebarContent 
            sections={sections}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            lesson={lesson}
            setShowSidebar={setShowSidebar}
          />
        </div>
      </div>
      
      {/* Main content layout (sidebar + content) */}
      <div className="flex flex-col lg:flex-row">
        {/* Desktop sidebar (fixed on left) */}
        <div className="hidden lg:block lg:w-64 p-6 border-r border-border-light h-screen sticky top-0 overflow-y-auto z-10">
          <SidebarContent 
            sections={sections}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            lesson={lesson}
            setShowSidebar={setShowSidebar}
          />
        </div>
        
        {/* Main content area */}
        <div className="flex-1 p-4 lg:p-8 overflow-hidden" ref={contentRef}>
          {/* Desktop lesson metadata */}
          <div className="hidden lg:block mb-8">
            <Link href="/lessons" className="text-primary hover:underline inline-flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to lessons
            </Link>
            
            {lesson && (
              <>
                <h1 className="text-3xl font-bold text-text-primary mb-2">{lesson.title}</h1>
                <p className="text-text-secondary mb-4">{lesson.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="bg-bg-secondary px-3 py-1 rounded-full text-text-secondary">
                    <span className="font-medium">Difficulty:</span> {lesson.difficulty}
                  </div>
                  <div className="bg-bg-secondary px-3 py-1 rounded-full text-text-secondary">
                    <span className="font-medium">Est. Time:</span> {lesson.duration}
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Current section content */}
          {sections.length > 0 && (
            <div className="custom-markdown mt-4 overflow-hidden">
              {activeIndex === 0 ? (
                // First section intro content
                <div className="text-text-secondary mb-8 overflow-x-auto">
                  <h2 className="text-2xl font-bold text-text-primary mb-4">{sections[activeIndex].title}</h2>
                  <div className="prose prose-sm max-w-none">
                    <MarkdownRenderer content={sections[activeIndex].content} />
                  </div>
                </div>
              ) : (
                // Other section content with ContentRenderer
                <ContentRenderer 
                  contentKey={activeIndex.toString()}
                  contentElements={sections}
                />
              )}
            </div>
          )}
          
          {/* Navigation buttons */}
          <div className="mt-12 flex justify-between items-center">
            <button
              disabled={activeIndex === 0}
              onClick={() => {
                if (activeIndex > 0) {
                  setActiveIndex(activeIndex - 1);
                  contentRef.current?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`flex items-center px-4 py-2 rounded-md ${
                activeIndex === 0
                  ? 'text-text-secondary bg-bg-secondary/50 cursor-not-allowed'
                  : 'text-white bg-primary hover:bg-primary-dark'
              } transition-colors`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            
            <div className="text-sm text-text-secondary hidden md:block">
              <span className="font-medium">{activeIndex + 1}</span> of {sections.length}
            </div>
            
            <button
              disabled={activeIndex === sections.length - 1}
              onClick={() => {
                if (activeIndex < sections.length - 1) {
                  setActiveIndex(activeIndex + 1);
                  contentRef.current?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`flex items-center px-4 py-2 rounded-md ${
                activeIndex === sections.length - 1
                  ? 'text-text-secondary bg-bg-secondary/50 cursor-not-allowed'
                  : 'text-white bg-primary hover:bg-primary-dark'
              } transition-colors`}
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* Next Lesson CTA - Only shown at the end */}
          {activeIndex === sections.length - 1 && (
            <div className="bg-bg-accent rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Ready to Move On?
              </h3>
              <p className="text-text-secondary mb-4">
                You've completed this lesson! Ready for the next one?
              </p>
              <button className="px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary-dark transition-colors">
                Continue to Next Lesson
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonDetail; 