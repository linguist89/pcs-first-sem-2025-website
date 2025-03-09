'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const RecentLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchLessons();
  }, []);
  
  const fetchLessons = async () => {
    setIsLoading(true);
    try {
      // Fetch lessons from the API endpoint that reads markdown files
      const response = await fetch('/api/lessons');
      const data = await response.json();
      
      // Sort lessons by lastUpdated date (most recent first)
      const sortedLessons = [...data].sort((a, b) => {
        return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      });
      
      // Get the 4 most recently updated lessons
      setLessons(sortedLessons.slice(0, 4));
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      setIsLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };
  
  return (
    <section className="py-12 bg-bg-secondary">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Recent Lessons</h2>
          <p className="text-text-secondary">Continue where you left off or explore new content</p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-64 bg-bg-primary animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {lessons.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/lessons/${lesson.id}`}
                className="group bg-bg-primary rounded-lg overflow-hidden shadow-light hover:shadow-medium transition-shadow border border-border-light"
              >
                {/* Lesson Image */}
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={lesson.image}
                    alt={lesson.title}
                    width={500}
                    height={300}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Module Tag */}
                  <div className="absolute top-2 left-2">
                    <div className="bg-primary text-white text-xs px-2 py-1 rounded-md">
                      {lesson.module}
                    </div>
                  </div>
                  
                  {/* Duration */}
                  <div className="absolute top-2 right-2">
                    <div className="bg-bg-primary bg-opacity-80 text-text-primary text-xs px-2 py-1 rounded-md flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {lesson.duration} min
                    </div>
                  </div>
                </div>
                
                {/* Lesson Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-text-primary mb-1 group-hover:text-primary transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                    {lesson.description}
                  </p>
                  
                  {/* Progress */}
                  <div className="mt-auto">
                    <div className="flex justify-between items-center text-xs text-text-secondary mb-1">
                      <span>{lesson.progress > 0 ? `${lesson.progress}% complete` : 'Not started'}</span>
                      <span>Updated {formatDate(lesson.lastUpdated)}</span>
                    </div>
                    <div className="h-1.5 w-full bg-bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${lesson.progress}%` }}
                        aria-valuenow={lesson.progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        role="progressbar"
                      ></div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Link 
            href="/lessons"
            className="text-primary hover:text-primary-dark transition-colors font-medium flex items-center justify-center"
          >
            <span>View All Lessons</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RecentLessons; 