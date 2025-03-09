'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

const ClassDetailsModal = ({ classDetails, onClose }) => {
  const modalRef = useRef(null);
  
  useEffect(() => {
    // Add event listener for clicks outside the modal
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    // Add event listener for escape key
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    // Add the event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    
    // Prevent scrolling on the body when modal is open
    document.body.style.overflow = 'hidden';
    
    // Remove event listeners on cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);
  
  // Format date and time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };
  
  // Calculate end time
  const getEndTime = (dateString, durationMinutes) => {
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() + durationMinutes);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };
  
  // Add to calendar function
  const addToCalendar = () => {
    const startDate = new Date(classDetails.date);
    const endDate = new Date(startDate.getTime() + classDetails.duration * 60000);
    
    // Format dates for Google Calendar link
    const formatForCalendar = (date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };
    
    const startFormatted = formatForCalendar(startDate);
    const endFormatted = formatForCalendar(endDate);
    
    // Create Google Calendar link
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(classDetails.title)}&details=${encodeURIComponent(classDetails.description)}&location=${encodeURIComponent(classDetails.location)}&dates=${startFormatted}/${endFormatted}`;
    
    // Open calendar link in new tab
    window.open(calendarUrl, '_blank');
  };
  
  return (
    <div className="fixed inset-0 bg-neutral-dark bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div 
        ref={modalRef}
        className="bg-bg-primary rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all animate-modalFade"
      >
        {/* Modal Header */}
        <div className="bg-gradient-primary p-5 rounded-t-xl">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-text-inverse">{classDetails.title}</h2>
            <button 
              onClick={onClose}
              className="ml-4 text-text-inverse hover:text-text-inverse/80 transition-colors p-1 rounded-full hover:bg-text-inverse hover:bg-opacity-10"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Modal Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-text-secondary mb-4 text-lg">{classDetails.description}</p>
            
            {/* Date and Time */}
            <div className="bg-bg-pattern-light rounded-lg p-5 mb-6">
              <div className="flex items-center text-text-primary mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">{formatDate(classDetails.date)}</span>
              </div>
              
              <div className="flex items-center text-text-primary mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  {formatTime(classDetails.date)} - {getEndTime(classDetails.date, classDetails.duration)} 
                  <span className="ml-2 text-text-secondary text-sm bg-bg-secondary px-2 py-0.5 rounded-full">{classDetails.duration} minutes</span>
                </span>
              </div>
              
              <div className="flex items-center text-text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{classDetails.location}</span>
              </div>
            </div>
            
            {/* Instructor Info */}
            <div className="flex items-center p-4 bg-bg-secondary rounded-lg mb-6">
              <div className="bg-gradient-accent rounded-full h-16 w-16 flex items-center justify-center mr-4 text-text-inverse shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-text-primary text-lg">{classDetails.instructor}</div>
                <div className="text-text-secondary">Course Instructor</div>
              </div>
            </div>
            
            {/* Additional Content (placeholder) */}
            <div className="mb-6">
              <h3 className="font-medium text-text-primary text-lg mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-secondary-color" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Materials Required
              </h3>
              <ul className="list-disc pl-8 text-text-secondary space-y-1.5">
                <li>Notebook and pen</li>
                <li>Laptop with required software installed</li>
                <li>Completed homework from previous class</li>
              </ul>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium text-text-primary text-lg mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-secondary-color" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Prerequisites
              </h3>
              <p className="text-text-secondary">Completion of previous modules or equivalent knowledge. Basic understanding of the subject matter is recommended.</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            {classDetails.link ? (
              <Link 
                href={classDetails.link}
                className="inline-flex items-center px-5 py-2.5 bg-gradient-primary text-text-inverse rounded-md hover:opacity-90 transition-opacity shadow-md"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Join Virtual Class
              </Link>
            ) : (
              <Link 
                href="/lessons"
                className="inline-flex items-center px-5 py-2.5 bg-gradient-primary text-text-inverse rounded-md hover:opacity-90 transition-opacity shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                View Course Materials
              </Link>
            )}
            
            <button 
              onClick={addToCalendar}
              className="inline-flex items-center px-5 py-2.5 bg-secondary-color text-text-inverse rounded-md hover:opacity-90 transition-opacity shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Add to Calendar
            </button>
            
            <button 
              onClick={onClose}
              className="inline-flex items-center px-5 py-2.5 border border-border-light text-text-primary rounded-md hover:bg-bg-secondary transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetailsModal; 