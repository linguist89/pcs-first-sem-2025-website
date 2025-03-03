'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BrainLogo from './icons/BrainLogo';

const Header = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  
  useEffect(() => {
    // Check user preference and current class on document
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const hasDarkClass = document.documentElement.classList.contains('dark-theme');
    
    // Set state based on class or media query
    setIsDarkTheme(hasDarkClass || darkModeMediaQuery.matches);
    
    // Apply class if needed based on media query
    if (darkModeMediaQuery.matches && !hasDarkClass) {
      document.documentElement.classList.add('dark-theme');
    }
    
    // Listen for changes in media query
    const handleChange = (e) => {
      if (!document.documentElement.classList.contains('dark-theme') && e.matches) {
        document.documentElement.classList.add('dark-theme');
        setIsDarkTheme(true);
      } else if (document.documentElement.classList.contains('dark-theme') && !e.matches) {
        document.documentElement.classList.remove('dark-theme');
        setIsDarkTheme(false);
      }
    };
    
    darkModeMediaQuery.addEventListener('change', handleChange);
    
    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  const toggleTheme = () => {
    const newThemeState = !isDarkTheme;
    setIsDarkTheme(newThemeState);
    
    // Apply or remove class on html element
    if (newThemeState) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  };
  
  return (
    <header className="bg-[color:var(--color-primary)] shadow-md sticky top-0 z-50 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <BrainLogo className="w-10 h-10" primaryColor="white" secondaryColor="rgba(255,255,255,0.9)" />
          <span className="text-xl font-semibold">Python for CogSci</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="font-medium hover:text-white/80 transition-colors">Home</Link>
          <Link href="/lessons" className="font-medium hover:text-white/80 transition-colors">Lessons</Link>
          <Link href="/resources" className="font-medium hover:text-white/80 transition-colors">Resources</Link>
          <Link href="/about" className="font-medium hover:text-white/80 transition-colors">About</Link>
        </nav>
        
        <button 
          onClick={toggleTheme} 
          className="btn ripple p-2 rounded-full text-white hover:bg-white/10 cursor-pointer"
          aria-label="Toggle theme"
        >
          {isDarkTheme ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header; 