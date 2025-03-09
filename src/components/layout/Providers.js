'use client';

import { useEffect } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { UserProvider } from '@/context/UserContext';
import { CourseProvider } from '@/context/CourseContext';
import { initAnalytics, trackPageView } from '@/lib/analytics';

export default function Providers({ children }) {
  // Initialize analytics
  useEffect(() => {
    initAnalytics();
    
    // Track initial page view
    trackPageView(window.location.pathname);
    
    // Track page views when route changes
    const handleRouteChange = (url) => {
      trackPageView(url);
    };
    
    // This is a simplified version for demo purposes
    // In a real Next.js app, we would use the router events
    window.addEventListener('popstate', () => {
      handleRouteChange(window.location.pathname);
    });
    
    return () => {
      window.removeEventListener('popstate', () => {
        handleRouteChange(window.location.pathname);
      });
    };
  }, []);
  
  return (
    <ThemeProvider>
      <UserProvider>
        <CourseProvider>
          {children}
        </CourseProvider>
      </UserProvider>
    </ThemeProvider>
  );
} 