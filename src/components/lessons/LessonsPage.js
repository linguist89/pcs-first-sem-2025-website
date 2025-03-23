'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

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
    <motion.span 
      whileHover={{ scale: 1.05 }}
      className={`${style.bg} ${style.text} ${style.border} rounded-full px-3 py-1 text-sm font-medium border`}
    >
      {level}
    </motion.span>
  );
};

const LessonCard = ({ lesson, index }) => {
  if (!lesson || !lesson.id) {
    return null;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link 
        href={`/lessons/${lesson.id}`}
        className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <motion.span 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="inline-block bg-[#3B82F6] text-white text-sm font-bold rounded-full h-8 w-8 flex items-center justify-center"
            >
              {lesson.id}
            </motion.span>
            <DifficultyBadge level={lesson.difficulty} />
          </div>
          <h2 className="text-xl font-bold text-[#1F2937] mb-2 line-clamp-2">{lesson.title}</h2>
          <p className="text-[#4B5563] mb-4 text-sm line-clamp-3">{lesson.description}</p>
          <div className="flex justify-between items-center text-sm text-[#4B5563]">
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {lesson.duration}
            </span>
            <motion.span 
              className="text-[#3B82F6] font-medium"
              whileHover={{ x: 3 }}
            >
              View Lesson →
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.div>
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
      
      // Ensure we always have an array of lessons
      setLessons(Array.isArray(data) ? data : []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      setIsLoading(false);
    }
  };

  // Make sure filteredLessons is always an array
  const filteredLessons = Array.isArray(lessons) 
    ? (filter === 'all' 
        ? lessons 
        : lessons.filter(lesson => lesson.difficulty === filter))
    : [];
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12">
      <motion.div 
        className="container mx-auto px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.header 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-[#1F2937] mb-4">Python Cognitive Science</h1>
          <p className="text-xl text-[#4B5563] max-w-3xl mx-auto">
            Learn the fundamentals of Python programming for cognitive science research and data analysis
          </p>
        </motion.header>
        
        {/* Filter controls */}
        <motion.div 
          className="mb-8 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                filter === 'all' 
                  ? 'bg-[#3B82F6] text-white' 
                  : 'bg-white text-[#1F2937] hover:bg-gray-100'
              }`}
            >
              All Lessons
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setFilter('Beginner')}
              className={`px-4 py-2 text-sm font-medium ${
                filter === 'Beginner' 
                  ? 'bg-[#3B82F6] text-white' 
                  : 'bg-white text-[#1F2937] hover:bg-gray-100'
              }`}
            >
              Beginner
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setFilter('Intermediate')}
              className={`px-4 py-2 text-sm font-medium ${
                filter === 'Intermediate' 
                  ? 'bg-[#3B82F6] text-white' 
                  : 'bg-white text-[#1F2937] hover:bg-gray-100'
              }`}
            >
              Intermediate
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setFilter('Advanced')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                filter === 'Advanced' 
                  ? 'bg-[#3B82F6] text-white' 
                  : 'bg-white text-[#1F2937] hover:bg-gray-100'
              }`}
            >
              Advanced
            </motion.button>
          </div>
        </motion.div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <motion.div 
                key={index} 
                className="h-64 bg-white animate-pulse rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.5, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              />
            ))}
          </div>
        ) : (
          <>
            {filteredLessons.length === 0 ? (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-medium text-[#1F2937] mb-2">No lessons found</h3>
                <p className="text-[#4B5563]">Try changing your filter or check back later for new content.</p>
              </motion.div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {filteredLessons.map((lesson, index) => (
                  <LessonCard key={lesson.id} lesson={lesson} index={index} />
                ))}
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default LessonsPage; 