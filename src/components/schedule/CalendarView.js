'use client';

import { useState } from 'react';
import ClassDetailsModal from './ClassDetailsModal';

const CalendarView = ({ classes, currentMonth, currentYear }) => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get all days in the specified month
  const getDaysInMonth = () => {
    const date = new Date(currentYear, currentMonth, 1);
    const days = [];
    
    // Get the first day of the month
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    
    // Add padding days from previous month
    for (let i = 0; i < firstDay; i++) {
      const prevMonthDate = new Date(currentYear, currentMonth, 0 - i);
      days.unshift({
        date: prevMonthDate,
        isCurrentMonth: false,
        classes: getClassesForDate(prevMonthDate)
      });
    }
    
    // Add days of current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(currentYear, currentMonth, i);
      days.push({
        date: currentDate,
        isCurrentMonth: true,
        isToday: isToday(currentDate),
        classes: getClassesForDate(currentDate)
      });
    }
    
    // Ensure we have exactly 6 weeks (42 days) for consistent calendar size
    const totalDaysNeeded = 42;
    if (days.length < totalDaysNeeded) {
      const daysToAdd = totalDaysNeeded - days.length;
      for (let i = 1; i <= daysToAdd; i++) {
        const nextMonthDate = new Date(currentYear, currentMonth + 1, i);
        days.push({
          date: nextMonthDate,
          isCurrentMonth: false,
          classes: getClassesForDate(nextMonthDate)
        });
      }
    }
    
    return days;
  };
  
  // Check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  // Get classes scheduled for a specific date
  const getClassesForDate = (date) => {
    return classes.filter(classItem => {
      const classDate = new Date(classItem.date);
      return classDate.getDate() === date.getDate() &&
        classDate.getMonth() === date.getMonth() &&
        classDate.getFullYear() === date.getFullYear();
    });
  };
  
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
  
  // Get days of the week
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Get all calendar days
  const calendarDays = getDaysInMonth();
  
  return (
    <div className="bg-bg-primary border border-border-light rounded-lg shadow-md overflow-hidden">
      {/* Calendar Header - Days of Week */}
      <div className="grid grid-cols-7 bg-gradient-primary">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="py-3 text-center font-medium text-text-inverse">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 border-t border-border-light">
        {calendarDays.map((day, index) => (
          <div 
            key={index} 
            className={`min-h-[130px] border-b border-r border-border-light p-1.5 transition-colors ${
              !day.isCurrentMonth ? 'bg-bg-secondary bg-opacity-40' : 'hover:bg-bg-accent hover:bg-opacity-30'
            } ${day.isToday ? 'bg-background-accent' : ''}`}
          >
            {/* Date Number */}
            <div className={`flex justify-end mb-1.5 ${
              day.isToday 
                ? 'bg-primary-color text-text-inverse rounded-full w-7 h-7 flex items-center justify-center ml-auto shadow-sm' 
                : day.isCurrentMonth ? 'text-text-primary font-medium' : 'text-text-secondary opacity-60'
            }`}>
              {day.date.getDate()}
            </div>
            
            {/* Classes for this date */}
            <div className="space-y-1.5">
              {day.classes.slice(0, 2).map((classItem) => (
                <button
                  key={classItem.id}
                  onClick={() => openClassDetails(classItem)}
                  className="w-full text-left bg-primary bg-opacity-80 text-text-inverse hover:bg-opacity-90 p-1.5 rounded-md text-xs transition-all duration-200 overflow-hidden border-l-2 border-primary transform hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <div className="font-medium text-text-inverse truncate">{formatTime(classItem.date)}</div>
                  <div className="truncate">{classItem.title}</div>
                </button>
              ))}
              
              {day.classes.length > 2 && (
                <button 
                  onClick={() => openClassDetails(day.classes[2])}
                  className="text-xs px-2 py-0.5 bg-secondary-color bg-opacity-80 text-text-inverse rounded-full hover:bg-opacity-90 transition-colors w-full text-center"
                >
                  +{day.classes.length - 2} more
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
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

export default CalendarView; 