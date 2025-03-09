'use client';

import { useState } from 'react';
import ClassDetailsModal from './ClassDetailsModal';

const ListViewSchedule = ({ classes }) => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'this-week', 'this-month', 'past'
  
  // Sort classes by date
  const sortedClasses = [...classes].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );
  
  // Filter classes based on selected filter
  const filteredClasses = sortedClasses.filter(classItem => {
    const classDate = new Date(classItem.date);
    const today = new Date();
    
    switch (filter) {
      case 'this-week':
        // Get start and end of current week
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        
        return classDate >= startOfWeek && classDate <= endOfWeek;
        
      case 'this-month':
        // Check if in current month
        return classDate.getMonth() === today.getMonth() && 
               classDate.getFullYear() === today.getFullYear();
        
      case 'past':
        // Check if date is in the past
        today.setHours(0, 0, 0, 0);
        return classDate < today;
        
      default: // 'all'
        return true;
    }
  });
  
  // Group classes by date
  const groupedClasses = filteredClasses.reduce((groups, classItem) => {
    const date = new Date(classItem.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    if (!groups[date]) {
      groups[date] = [];
    }
    
    groups[date].push(classItem);
    return groups;
  }, {});
  
  // Format time from date string
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };
  
  // Open modal with class details
  const openClassDetails = (classItem) => {
    setSelectedClass(classItem);
    setIsModalOpen(true);
  };
  
  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedClass(null);
  };
  
  // Check if date is today
  const isToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md transition-all duration-200 ${filter === 'all' 
            ? 'bg-primary text-text-inverse shadow-md' 
            : 'bg-bg-secondary text-text-primary hover:bg-bg-accent hover:shadow-sm transform hover:-translate-y-0.5'}`}
        >
          All Classes
        </button>
        <button 
          onClick={() => setFilter('this-week')}
          className={`px-4 py-2 rounded-md transition-all duration-200 ${filter === 'this-week' 
            ? 'bg-primary text-text-inverse shadow-md' 
            : 'bg-bg-secondary text-text-primary hover:bg-bg-accent hover:shadow-sm transform hover:-translate-y-0.5'}`}
        >
          This Week
        </button>
        <button 
          onClick={() => setFilter('this-month')}
          className={`px-4 py-2 rounded-md transition-all duration-200 ${filter === 'this-month' 
            ? 'bg-primary text-text-inverse shadow-md' 
            : 'bg-bg-secondary text-text-primary hover:bg-bg-accent hover:shadow-sm transform hover:-translate-y-0.5'}`}
        >
          This Month
        </button>
        <button 
          onClick={() => setFilter('past')}
          className={`px-4 py-2 rounded-md transition-all duration-200 ${filter === 'past' 
            ? 'bg-primary text-text-inverse shadow-md' 
            : 'bg-bg-secondary text-text-primary hover:bg-bg-accent hover:shadow-sm transform hover:-translate-y-0.5'}`}
        >
          Past Classes
        </button>
      </div>
      
      {/* List of classes grouped by date */}
      {Object.keys(groupedClasses).length > 0 ? (
        Object.entries(groupedClasses).map(([date, dateClasses]) => (
          <div key={date} className="bg-bg-primary border border-border-light rounded-lg shadow-md overflow-hidden transform transition-transform hover:shadow-lg">
            {/* Date Header */}
            <div className={`p-4 font-medium text-lg ${isToday(dateClasses[0].date) 
              ? 'bg-gradient-primary text-text-inverse' 
              : 'bg-bg-secondary text-text-primary'}`}>
              {date} {isToday(dateClasses[0].date) && <span className="ml-2 text-sm font-normal bg-text-inverse bg-opacity-20 px-2 py-0.5 rounded-full">Today</span>}
            </div>
            
            {/* Classes for this date */}
            <div className="divide-y divide-border-light">
              {dateClasses.map((classItem) => (
                <div 
                  key={classItem.id}
                  className="p-4 flex flex-col md:flex-row md:items-center hover:bg-bg-accent transition-all cursor-pointer"
                  onClick={() => openClassDetails(classItem)}
                >
                  {/* Time */}
                  <div className="md:w-48 font-medium text-primary mb-2 md:mb-0">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatTime(classItem.date)}
                    </div>
                    <div className="text-xs text-text-secondary ml-5.5 pl-0.5">
                      {classItem.duration} minutes
                    </div>
                  </div>
                  
                  {/* Class Details */}
                  <div className="flex-grow">
                    <h3 className="font-medium text-text-primary">{classItem.title}</h3>
                    <p className="text-text-secondary text-sm">{classItem.description}</p>
                    
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-secondary">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-secondary-color" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{classItem.location}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-secondary-color" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{classItem.instructor}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <div className="mt-3 md:mt-0 md:ml-4">
                    <button className="inline-flex items-center px-4 py-2 text-sm bg-primary text-text-inverse rounded-md hover:bg-primary-dark transition-colors shadow-sm hover:shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="bg-bg-pattern-light border border-border-light rounded-lg shadow-md p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-secondary-color opacity-50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-text-secondary mb-4 text-lg">No classes found for the selected filter.</p>
          <button 
            onClick={() => setFilter('all')}
            className="text-primary hover:underline font-medium"
          >
            View all classes
          </button>
        </div>
      )}
      
      {/* Class Details Modal */}
      {isModalOpen && selectedClass && (
        <ClassDetailsModal 
          classDetails={selectedClass} 
          onClose={closeModal} 
        />
      )}
    </div>
  );
};

export default ListViewSchedule; 