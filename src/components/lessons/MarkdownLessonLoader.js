'use client';

import { useState, useEffect, useRef } from 'react';
import matter from 'gray-matter';
import LessonContent from './LessonContent';
import TableOfContentsSidebar from './TableOfContents';

/**
 * Component that loads lessons from markdown files
 * @param {string} lessonId - The ID of the lesson to load
 * @param {function} onLoad - Callback for when the lesson is loaded
 */
export default function MarkdownLessonLoader({ 
  lessonId,
  onLoad = () => {}
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lessonData, setLessonData] = useState(null);
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Track if data has been loaded to prevent unnecessary reloads
  const dataLoadedRef = useRef(false);

  // Load lesson data only once when component mounts or lessonId changes
  useEffect(() => {
    // Skip if no lessonId or if data is already loaded for this lessonId
    if (!lessonId || dataLoadedRef.current) return;
    
    async function loadLessonData() {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch lesson metadata
        const metadataResponse = await fetch(`/api/lessons/${lessonId}/metadata`);
        
        if (!metadataResponse.ok) {
          throw new Error(`Failed to load lesson ${lessonId}`);
        }
        
        const data = await metadataResponse.json();
        setLessonData(data);
        onLoad(data);
        
        // Load each section
        if (data.sections && data.sections.length > 0) {
          const loadedSections = [];
          
          for (const sectionId of data.sections) {
            try {
              const sectionResponse = await fetch(`/api/lessons/${lessonId}/sections/${sectionId}`);
              
              if (!sectionResponse.ok) {
                console.warn(`Failed to load section ${sectionId}`);
                continue;
              }
              
              const sectionContent = await sectionResponse.text();
              const { data: frontMatter, content } = matter(sectionContent);
              
              loadedSections.push({
                id: sectionId,
                content,
                ...frontMatter
              });
            } catch (error) {
              console.error(`Error loading section ${sectionId}:`, error);
            }
          }
          
          setSections(loadedSections);
        }
        
        // Mark that data has been loaded
        dataLoadedRef.current = true;
      } catch (error) {
        console.error('Error loading lesson:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadLessonData();
    
    // Reset on unmount or lessonId change
    return () => {
      dataLoadedRef.current = false;
    };
  }, [lessonId, onLoad]);
  
  const handleSectionClick = (index) => {
    setActiveSection(index);
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-4 text-gray-600">Loading lesson content...</p>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-medium mb-2">Error Loading Lesson</h3>
          <p>{error}</p>
          <button 
            onClick={() => {
              dataLoadedRef.current = false;
              window.location.reload();
            }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  // Show empty state if no lesson data
  if (!lessonData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-6 max-w-md text-center">
          <h3 className="text-lg font-medium mb-2">Lesson Not Found</h3>
          <p>The requested lesson could not be found or has no content.</p>
        </div>
      </div>
    );
  }
  
  // Show empty sections message if no sections are loaded
  if (sections.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-6 max-w-md text-center">
          <h3 className="text-lg font-medium mb-2">{lessonData.title}</h3>
          <p className="mb-4">{lessonData.description}</p>
          <p>This lesson is currently under development. Content will be added soon!</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen bg-white relative">
      {/* Table of Contents Sidebar */}
      <TableOfContentsSidebar
        content={sections}
        onSectionClick={handleSectionClick}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 w-full ${sidebarOpen ? 'ml-[280px]' : 'ml-[40px]'}`}>
        <LessonContent
          sections={sections}
          activeSection={activeSection}
          lessonTitle={lessonData.title}
          lessonDescription={lessonData.description}
          lessonDifficulty={lessonData.difficulty}
          lessonDuration={lessonData.duration}
          dataUrl={lessonData.dataUrl}
        />
      </div>
    </div>
  );
} 