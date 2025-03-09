'use client';

import { useState, useEffect } from 'react';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dismissedIds, setDismissedIds] = useState([]);
  
  // Get dismissed announcements from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('dismissedAnnouncements');
    if (saved) {
      setDismissedIds(JSON.parse(saved));
    }
    
    // Fetch announcements data
    fetchAnnouncements();
  }, []);
  
  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/data/announcements.json');
      const data = await response.json();
      setAnnouncements(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setIsLoading(false);
    }
  };
  
  const dismissAnnouncement = (id) => {
    const updated = [...dismissedIds, id];
    setDismissedIds(updated);
    localStorage.setItem('dismissedAnnouncements', JSON.stringify(updated));
  };
  
  // Filter out dismissed announcements
  const visibleAnnouncements = announcements.filter(
    announcement => !dismissedIds.includes(announcement.id)
  );
  
  // If no visible announcements, don't render the component
  if (visibleAnnouncements.length === 0 && !isLoading) {
    return null;
  }
  
  return (
    <section className="bg-bg-primary py-4">
      <div className="container mx-auto px-4">
        <h2 className="sr-only">Announcements</h2>
        
        {isLoading ? (
          <div className="h-16 bg-bg-secondary animate-pulse rounded-md"></div>
        ) : (
          <div className="space-y-3">
            {visibleAnnouncements.map((announcement) => (
              <div 
                key={announcement.id} 
                className={`flex items-start p-4 rounded-md ${getAnnouncementBgColor(announcement.type)}`}
              >
                <div className="mr-3 mt-0.5">
                  {getAnnouncementIcon(announcement.type)}
                </div>
                <div className="flex-1">
                  <p className="text-text-primary">
                    {announcement.message}
                  </p>
                  <p className="text-sm text-text-secondary mt-1">
                    Posted on {formatDate(announcement.date)}
                  </p>
                </div>
                <button 
                  onClick={() => dismissAnnouncement(announcement.id)}
                  className="ml-2 p-1 text-text-secondary hover:text-text-primary transition-colors"
                  aria-label="Dismiss announcement"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// Helper functions
const getAnnouncementBgColor = (type) => {
  switch (type) {
    case 'info':
      return 'bg-info/10 border border-info/30';
    case 'warning':
      return 'bg-warning/10 border border-warning/30';
    case 'success':
      return 'bg-success/10 border border-success/30';
    case 'error':
      return 'bg-error/10 border border-error/30';
    default:
      return 'bg-bg-secondary';
  }
};

const getAnnouncementIcon = (type) => {
  switch (type) {
    case 'info':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'warning':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case 'success':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'error':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    default:
      return null;
  }
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
};

export default Announcements; 