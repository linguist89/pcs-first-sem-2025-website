'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LessonList() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLessons() {
      try {
        setLoading(true);
        
        // For now, we'll hardcode the lesson IDs we know exist
        // In a real app, you might have an API endpoint that returns all lessons
        const lessonIds = [1, 2, 3];
        
        const lessonPromises = lessonIds.map(async (id) => {
          try {
            // Ensure we're using the numeric ID format as used in the file system
            const response = await fetch(`/api/lessons/${id}/metadata`);
            
            if (response.ok) {
              return await response.json();
            }
            return null;
          } catch (err) {
            console.warn(`Error loading lesson ${id}:`, err);
            return null;
          }
        });
        
        const loadedLessons = await Promise.all(lessonPromises);
        setLessons(loadedLessons.filter(Boolean));
        setLoading(false);
      } catch (err) {
        console.error('Error loading lessons:', err);
        setError('Failed to load lessons. Please try again later.');
        setLoading(false);
      }
    }
    
    fetchLessons();
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-4 text-gray-600">Loading lessons...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 my-4">
        <h3 className="text-lg font-medium mb-2">Error</h3>
        <p>{error}</p>
      </div>
    );
  }
  
  if (lessons.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-6 my-4 text-center">
        <h3 className="text-lg font-medium mb-2">No Lessons Available</h3>
        <p>There are currently no lessons available. Check back later!</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lessons.map((lesson) => (
        <Link
          href={`/lessons/${lesson.id}`}
          key={lesson.id}
          className="group block border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 hover:shadow-md transition-all"
        >
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-24 flex items-center justify-center">
            <span className="text-white text-5xl font-bold opacity-30 group-hover:opacity-50 transition-opacity">
              #{lesson.id}
            </span>
          </div>
          
          <div className="p-6">
            <div className="flex space-x-2 mb-2">
              {lesson.difficulty && (
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {lesson.difficulty}
                </span>
              )}
              {lesson.duration && (
                <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {lesson.duration}
                </span>
              )}
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
              {lesson.title}
            </h3>
            
            {lesson.description && (
              <p className="text-gray-600 text-sm line-clamp-3">{lesson.description}</p>
            )}
            
            <div className="mt-4 flex justify-end">
              <span className="text-sm text-blue-600 font-medium group-hover:text-blue-700 transition-colors flex items-center">
                Start Lesson
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 