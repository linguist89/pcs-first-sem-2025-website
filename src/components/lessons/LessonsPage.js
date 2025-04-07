'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const DifficultyBadge = ({ level }) => {
  const colors = {
    'Beginner': {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-300',
      border: 'border-green-200 dark:border-green-800'
    },
    'Intermediate': {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-800 dark:text-yellow-300',
      border: 'border-yellow-200 dark:border-yellow-800'
    },
    'Advanced': {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-800 dark:text-red-300',
      border: 'border-red-200 dark:border-red-800'
    }
  };
  
  const style = colors[level] || { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-800 dark:text-gray-300', border: 'border-gray-200 dark:border-gray-700' };
  
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
        className="block bg-[var(--card-bg)] dark:bg-[var(--card-bg)] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-[var(--card-border)]"
      >
        <div className="p-6">
          <div className="mb-3">
            <motion.span 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="inline-block bg-[var(--primary-color)] text-white text-sm font-bold rounded-full h-8 w-8 flex items-center justify-center"
            >
              {lesson.id}
            </motion.span>
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2 line-clamp-2">{lesson.title}</h2>
          <p className="text-[var(--text-secondary)] mb-4 text-sm line-clamp-3">{lesson.description}</p>
          <div className="flex justify-end items-center text-sm text-[var(--text-secondary)]">
            <motion.span 
              className="text-[var(--primary-color)] font-medium"
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
    <div className="min-h-screen bg-[var(--background-primary)] py-12">
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
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Python Cognitive Science</h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
            Learn the fundamentals of Python programming for cognitive science research and data analysis
          </p>
        </motion.header>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <motion.div 
                key={index} 
                className="h-64 bg-[var(--card-bg)] animate-pulse rounded-lg border border-[var(--card-border)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.5, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              />
            ))}
          </div>
        ) : (
          <>
            {lessons.length === 0 ? (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-medium text-[var(--text-primary)] mb-2">No lessons found</h3>
                <p className="text-[var(--text-secondary)]">Check back later for new content.</p>
              </motion.div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {lessons.map((lesson, index) => (
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