'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useUser } from '@/context/UserContext';
import { useCourse } from '@/context/CourseContext';

export default function UserProfile({ className = '' }) {
  const { user, logout } = useUser();
  const { getLessonProgress, getCompletedLessons } = useCourse();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  if (!user) {
    return null;
  }
  
  const completedLessons = getCompletedLessons();
  const progressPercentage = getLessonProgress();
  
  // Format last accessed date
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Profile Photo/Avatar (Clickable) */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center focus:outline-none"
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <div className="relative h-8 w-8 rounded-full overflow-hidden">
          <Image
            src={user.avatar}
            alt={user.name}
            fill
            sizes="32px"
            className="object-cover"
          />
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 ml-1 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      
      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-bg-primary rounded-lg shadow-lg border border-border-light z-50 overflow-hidden">
          {/* Profile Header */}
          <div className="p-4 flex items-center border-b border-border-light bg-bg-secondary">
            <div className="relative h-12 w-12 rounded-full overflow-hidden">
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="ml-3">
              <h3 className="font-semibold text-text-primary">{user.name}</h3>
              <p className="text-sm text-text-secondary">{user.role}</p>
            </div>
          </div>
          
          {/* Profile Details */}
          <div className="p-4">
            {/* Progress Information */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-text-secondary mb-2">Course Progress</h4>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-text-secondary">
                {completedLessons.length} lessons completed ({progressPercentage}%)
              </p>
            </div>
            
            {/* Last Accessed */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-text-secondary mb-1">Last Activity</h4>
              <p className="text-sm text-text-primary">
                {formatDate(user.progress?.lastAccessed)}
              </p>
            </div>
            
            {/* User Actions */}
            <div className="pt-3 border-t border-border-light">
              <button
                onClick={logout}
                className="text-sm text-error-color hover:text-error-color/80 font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 