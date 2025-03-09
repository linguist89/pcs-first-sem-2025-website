'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { fetchLessons, fetchResources } from '@/lib/data';
import { useUser } from './UserContext';

// Initial course context state
const initialState = {
  lessons: [],
  resources: [],
  currentLessonId: null,
  isLoading: true,
  error: null,
  setCurrentLesson: () => {},
  getNextLesson: () => null,
  getPreviousLesson: () => null,
  getLessonById: () => null,
  getCompletedLessons: () => [],
  getLessonProgress: () => 0
};

// Create context
const CourseContext = createContext(initialState);

// Custom hook for accessing course context
export const useCourse = () => useContext(CourseContext);

// Course provider component
export function CourseProvider({ children }) {
  const [lessons, setLessons] = useState([]);
  const [resources, setResources] = useState([]);
  const [currentLessonId, setCurrentLessonId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user } = useUser();
  
  // Fetch course data
  useEffect(() => {
    const loadCourseData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch lessons and resources in parallel
        const [lessonsData, resourcesData] = await Promise.all([
          fetchLessons(),
          fetchResources()
        ]);
        
        setLessons(lessonsData);
        setResources(resourcesData);
        
        // Set current lesson from user progress if authenticated
        if (user?.progress?.currentLesson) {
          setCurrentLessonId(user.progress.currentLesson);
        } else if (lessonsData.length > 0) {
          // Default to first lesson
          setCurrentLessonId(lessonsData[0].id);
        }
      } catch (err) {
        console.error('Error loading course data:', err);
        setError('Failed to load course data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCourseData();
  }, [user]);
  
  // Get a lesson by ID
  const getLessonById = (lessonId) => {
    return lessons.find(lesson => lesson.id === lessonId) || null;
  };
  
  // Get the next lesson
  const getNextLesson = (currentId = currentLessonId) => {
    if (!currentId || !lessons.length) return null;
    
    const currentIndex = lessons.findIndex(lesson => lesson.id === currentId);
    if (currentIndex === -1 || currentIndex >= lessons.length - 1) return null;
    
    return lessons[currentIndex + 1];
  };
  
  // Get the previous lesson
  const getPreviousLesson = (currentId = currentLessonId) => {
    if (!currentId || !lessons.length) return null;
    
    const currentIndex = lessons.findIndex(lesson => lesson.id === currentId);
    if (currentIndex <= 0) return null;
    
    return lessons[currentIndex - 1];
  };
  
  // Get completed lessons
  const getCompletedLessons = () => {
    if (!user || !user.progress || !user.progress.completedLessons) {
      return [];
    }
    
    return user.progress.completedLessons.map(id => getLessonById(id)).filter(Boolean);
  };
  
  // Calculate course progress percentage
  const getLessonProgress = () => {
    if (!user || !user.progress || !user.progress.completedLessons || !lessons.length) {
      return 0;
    }
    
    return Math.round((user.progress.completedLessons.length / lessons.length) * 100);
  };
  
  // Context value
  const value = {
    lessons,
    resources,
    currentLessonId,
    isLoading,
    error,
    setCurrentLesson: setCurrentLessonId,
    getNextLesson,
    getPreviousLesson,
    getLessonById,
    getCompletedLessons,
    getLessonProgress
  };
  
  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
} 