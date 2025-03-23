'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Initial state with 'modern' as the default view
const initialState = {
  viewMode: 'modern', // 'classic' or 'modern'
  setViewMode: () => {},
  toggleViewMode: () => {}
};

// Create context
const LessonViewContext = createContext(initialState);

// Custom hook for accessing lesson view context
export const useLessonView = () => useContext(LessonViewContext);

// LessonView provider component
export function LessonViewProvider({ children }) {
  const [viewMode, setViewMode] = useState('modern');
  
  // Load saved preference from localStorage on initial mount
  useEffect(() => {
    const savedViewMode = localStorage.getItem('lesson-view-mode');
    if (savedViewMode === 'classic' || savedViewMode === 'modern') {
      setViewMode(savedViewMode);
    }
  }, []);
  
  // Save preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('lesson-view-mode', viewMode);
  }, [viewMode]);
  
  // Toggle between classic and modern views
  const toggleViewMode = () => {
    setViewMode(prevMode => prevMode === 'classic' ? 'modern' : 'classic');
  };
  
  // Context value
  const value = {
    viewMode,
    setViewMode,
    toggleViewMode
  };
  
  return (
    <LessonViewContext.Provider value={value}>
      {children}
    </LessonViewContext.Provider>
  );
} 