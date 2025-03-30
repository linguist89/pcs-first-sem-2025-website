'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MarkdownLessonLoader from './MarkdownLessonLoader';

export default function LessonPageClient({ lessonId }) {
  const router = useRouter();
  const [lesson, setLesson] = useState(null);
  
  // Handle lesson loaded event
  const handleLessonLoaded = (lessonData) => {
    setLesson(lessonData);
  };
  
  // Navigate to another lesson
  const handleNavigate = (lessonId) => {
    router.push(`/lessons/${lessonId}`);
  };
  
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Previous/Next Lesson Navigation */}
      {lesson && (
        <div className="bg-white border-b shadow-sm sticky top-16 z-40">
          <div className="container mx-auto px-4 py-2">
            <div className="flex justify-between">
              <div>
                {parseInt(lesson.id) > 1 && (
                  <button 
                    onClick={() => handleNavigate(parseInt(lesson.id) - 1)}
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
                {lesson.id && (
                  <button 
                    onClick={() => handleNavigate(parseInt(lesson.id) + 1)}
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
      )}
      
      {/* Lesson Content */}
      <MarkdownLessonLoader 
        lessonId={lessonId} 
        onLoad={handleLessonLoaded} 
      />
    </div>
  );
} 