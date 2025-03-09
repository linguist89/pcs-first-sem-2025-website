'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const UpcomingClasses = () => {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchClasses();
  }, []);
  
  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/data/upcoming-classes.json');
      const data = await response.json();
      setClasses(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setIsLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };
  
  const addToCalendar = (classItem) => {
    const startDate = new Date(classItem.date);
    const endDate = new Date(startDate.getTime() + classItem.duration * 60000);
    
    // Format dates for Google Calendar link
    const formatForCalendar = (date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };
    
    const startFormatted = formatForCalendar(startDate);
    const endFormatted = formatForCalendar(endDate);
    
    // Create Google Calendar link
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(classItem.title)}&details=${encodeURIComponent(classItem.description)}&location=${encodeURIComponent(classItem.location)}&dates=${startFormatted}/${endFormatted}`;
    
    // Open calendar link in new tab
    window.open(calendarUrl, '_blank');
  };
  
  return (
    <section className="py-12 bg-bg-primary">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Upcoming Classes</h2>
          <p className="text-text-secondary">Stay on track with your learning schedule</p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-48 bg-bg-secondary animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto pb-4">
            <div className="inline-flex space-x-4 md:grid md:grid-cols-4 md:gap-6 min-w-max md:min-w-0">
              {classes.slice(0, 4).map((classItem) => (
                <div 
                  key={classItem.id} 
                  className="w-72 md:w-auto bg-bg-primary border border-border-light rounded-lg shadow-light overflow-hidden"
                >
                  {/* Date banner */}
                  <div className="bg-primary text-white py-2 px-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{formatDate(classItem.date)}</span>
                      <span>{formatTime(classItem.date)}</span>
                    </div>
                  </div>
                  
                  {/* Class content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-text-primary mb-1">{classItem.title}</h3>
                    <p className="text-text-secondary text-sm mb-3">{classItem.description}</p>
                    
                    <div className="flex items-center text-text-secondary text-sm mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{classItem.duration} minutes</span>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center text-text-secondary text-sm mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{classItem.location}</span>
                      </div>
                      <div className="flex items-center text-text-secondary text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{classItem.instructor}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {classItem.link ? (
                        <Link 
                          href={classItem.link}
                          className="inline-flex items-center px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Join Meeting
                        </Link>
                      ) : (
                        <Link 
                          href="/lessons"
                          className="inline-flex items-center px-3 py-1.5 text-sm bg-bg-secondary text-text-primary rounded-md hover:bg-bg-accent transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          View Materials
                        </Link>
                      )}
                      
                      <button 
                        onClick={() => addToCalendar(classItem)}
                        className="inline-flex items-center px-3 py-1.5 text-sm border border-border-light text-text-primary rounded-md hover:bg-bg-secondary transition-colors"
                        aria-label="Add to calendar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <Link 
            href="/schedule"
            className="text-primary hover:text-primary-dark transition-colors font-medium flex items-center justify-center"
          >
            <span>View Full Schedule</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UpcomingClasses; 