'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import LessonRenderer from './LessonRenderer';
import { usePathname } from 'next/navigation';

// Table of contents component
const TableOfContents = ({ content, activeSection, onSectionClick }) => {
  if (!content || content.length === 0) return null;
  
  return (
    <div className="mb-6 bg-gray-50 rounded-lg p-4">
      <h2 className="text-lg font-bold text-gray-800 mb-2">Contents</h2>
      <ul className="space-y-1">
        {content.map((section, index) => {
          // Only show titled sections in TOC
          if (!section.title) return null;
          
          return (
            <li key={index}>
              <button
                onClick={() => onSectionClick(index)}
                className={`text-left w-full px-2 py-1 rounded ${
                  activeSection === index 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {section.title}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const ModernLessonDetail = ({ lessonId }) => {
  const [lesson, setLesson] = useState(null);
  const [content, setContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  const [error, setError] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    if (lessonId) {
      fetchLesson();
    }
  }, [lessonId]);
  
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
    setActiveSection(index);
    // Scroll to section
    document.getElementById(`section-${index}`)?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-300 text-red-800 p-4 rounded-lg">
        <h3 className="text-lg font-bold mb-2">Error</h3>
        <p>{error}</p>
        <Link href="/lessons" className="mt-4 inline-block text-blue-500 hover:underline">
          Return to Lessons
        </Link>
      </div>
    );
  }
  
  if (!lesson) {
    return (
      <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded-lg">
        <h3 className="text-lg font-bold mb-2">Lesson Not Found</h3>
        <p>The requested lesson could not be found.</p>
        <Link href="/lessons" className="mt-4 inline-block text-blue-500 hover:underline">
          Return to Lessons
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Lesson header */}
      <header className="mb-8">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div className="mb-2 md:mb-0">
            <span className="text-sm font-medium text-gray-500">Lesson {lessonId}</span>
            <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
          </div>
        </div>
        
        {/* Description */}
        {lesson.description && (
          <p className="text-gray-600 mb-4">{lesson.description}</p>
        )}
        
        {/* Topics */}
        {lesson.topics && lesson.topics.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {lesson.topics.map((topic, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </header>
      
      {/* Table of contents */}
      <TableOfContents 
        content={content} 
        activeSection={activeSection} 
        onSectionClick={handleSectionClick} 
      />
      
      {/* Lesson content */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <LessonRenderer 
          content={content}
        />
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between mb-8">
        <button
          onClick={() => navigateToLesson(lesson.prevLesson)}
          disabled={!lesson.prevLesson}
          className={`px-4 py-2 rounded-md flex items-center ${
            lesson.prevLesson 
              ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' 
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
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
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Next Lesson
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ModernLessonDetail; 