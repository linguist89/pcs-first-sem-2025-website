'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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

const LessonCard = ({ lesson }) => {
  if (!lesson || !lesson.id) {
    return null;
  }
  
  return (
    <Link 
      href={`/lessons/${lesson.id}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <span className="inline-block bg-primary text-white text-sm font-bold rounded-full h-8 w-8 flex items-center justify-center">
            {lesson.id}
          </span>
          <DifficultyBadge level={lesson.difficulty} />
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-2 line-clamp-2">{lesson.title}</h2>
        <p className="text-text-secondary mb-4 text-sm line-clamp-3">{lesson.description}</p>
        <div className="flex justify-between items-center text-sm text-text-secondary">
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {lesson.duration}
          </span>
          <span className="text-primary font-medium">View Lesson →</span>
        </div>
      </div>
    </Link>
  );
};

const LessonsPage = () => {
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    fetchLessons();
  }, []);
  
  const fetchLessons = async () => {
    try {
      // Fetch lessons from our API endpoint that reads markdown files
      const response = await fetch('/api/lessons');
      const data = await response.json();
      
      setLessons(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      setIsLoading(false);
    }
  };

  const filteredLessons = filter === 'all' 
    ? lessons 
    : lessons.filter(lesson => lesson.difficulty === filter);
  
  return (
    <div className="min-h-screen bg-bg-primary py-12">
      <div className="container mx-auto px-4">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-text-primary mb-4">Python Cognitive Science</h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Learn the fundamentals of Python programming for cognitive science research and data analysis
          </p>
        </header>
        
        {/* Filter controls */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                filter === 'all' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-text-primary hover:bg-gray-100'
              }`}
            >
              All Lessons
            </button>
            <button
              type="button"
              onClick={() => setFilter('Beginner')}
              className={`px-4 py-2 text-sm font-medium ${
                filter === 'Beginner' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-text-primary hover:bg-gray-100'
              }`}
            >
              Beginner
            </button>
            <button
              type="button"
              onClick={() => setFilter('Intermediate')}
              className={`px-4 py-2 text-sm font-medium ${
                filter === 'Intermediate' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-text-primary hover:bg-gray-100'
              }`}
            >
              Intermediate
            </button>
            <button
              type="button"
              onClick={() => setFilter('Advanced')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                filter === 'Advanced' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-text-primary hover:bg-gray-100'
              }`}
            >
              Advanced
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-64 bg-bg-secondary animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <>
            {filteredLessons.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-text-primary mb-2">No lessons found</h3>
                <p className="text-text-secondary">Try changing your filter or check back later for new content.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLessons.map((lesson) => (
                  <LessonCard key={lesson.id} lesson={lesson} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LessonsPage; 