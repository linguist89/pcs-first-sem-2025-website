'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CalendarView from './CalendarView';
import ListViewSchedule from './ListViewSchedule';

const SchedulePage = () => {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const router = useRouter();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/data/upcoming-classes.json');
      const data = await response.json();
      
      // Add more class entries for demonstration purposes
      const extendedClasses = [...data];
      
      // Add classes for the next 3 months
      const baseDate = new Date();
      for (let i = 0; i < 20; i++) {
        const newDate = new Date(baseDate);
        newDate.setDate(newDate.getDate() + Math.floor(Math.random() * 90) + 1); // Random date in next 90 days
        
        const newClass = {
          ...data[i % data.length], // Cycle through existing classes
          id: data.length + i + 1,
          date: newDate.toISOString(),
        };
        
        extendedClasses.push(newClass);
      }
      
      setClasses(extendedClasses);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setIsLoading(false);
    }
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  return (
    <main className="py-12">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-10">
          <div className="bg-gradient-primary p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-text-inverse">Class Schedule</h1>
                <p className="text-text-inverse opacity-90">View all upcoming classes and events in one place</p>
              </div>
              <div>
                <Link 
                  href="/"
                  className="inline-flex items-center bg-text-inverse bg-opacity-20 px-4 py-2 rounded-md hover:bg-opacity-30 transition-colors text-text-inverse"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
          
          {/* View Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-bg-primary shadow-sm rounded-lg p-4 border border-border-light">
            <div className="flex space-x-2 mb-4 sm:mb-0">
              <button 
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-md transition-all ${viewMode === 'calendar' 
                  ? 'bg-primary text-text-inverse shadow-md' 
                  : 'bg-bg-secondary text-text-primary hover:bg-bg-accent hover:shadow-sm transform hover:-translate-y-0.5'}`}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Calendar View
                </div>
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md transition-all ${viewMode === 'list' 
                  ? 'bg-primary text-text-inverse shadow-md' 
                  : 'bg-bg-secondary text-text-primary hover:bg-bg-accent hover:shadow-sm transform hover:-translate-y-0.5'}`}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  List View
                </div>
              </button>
            </div>
            
            {viewMode === 'calendar' && (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={goToPreviousMonth}
                  className="p-2 rounded-md bg-bg-secondary text-text-primary hover:bg-bg-accent transition-colors"
                  aria-label="Previous month"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <div className="text-lg font-medium text-text-primary">
                  {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                
                <button 
                  onClick={goToNextMonth}
                  className="p-2 rounded-md bg-bg-secondary text-text-primary hover:bg-bg-accent transition-colors"
                  aria-label="Next month"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <button 
                  onClick={goToToday}
                  className="ml-2 px-3 py-1.5 text-sm border border-border-light rounded-md hover:bg-bg-secondary transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Today
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-t-4 border-b-4 border-primary rounded-full animate-spin"></div>
              <div className="w-16 h-16 border-l-4 border-r-4 border-accent-color rounded-full animate-spin absolute top-0 left-0" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              <div className="mt-6 text-text-secondary text-center">Loading classes...</div>
            </div>
          </div>
        ) : (
          <>
            {viewMode === 'calendar' ? (
              <CalendarView 
                classes={classes} 
                currentMonth={currentMonth} 
                currentYear={currentYear}
              />
            ) : (
              <ListViewSchedule classes={classes} />
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default SchedulePage; 