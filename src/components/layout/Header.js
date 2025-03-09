'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';
import ThemeToggle from '@/components/ui/ThemeToggle';
import UserProfile from '@/components/ui/UserProfile';
import LoginForm from '@/components/ui/LoginForm';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { theme } = useTheme();
  const { user, isAuthenticated } = useUser();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const openLoginModal = () => {
    setShowLoginModal(true);
  };
  
  const closeLoginModal = () => {
    setShowLoginModal(false);
  };
  
  return (
    <header className="bg-bg-primary shadow-sm border-b border-border-light sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <svg width="24px" height="24px" viewBox="0 0 32 32" className="mr-2" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fillRule="evenodd">
                {/* Graduation Cap Base (Diamond) */}
                <path d="M16,4 L3,12 L16,20 L29,12 L16,4 Z" fill="#2563EB" />
                
                {/* Graduation Cap Top Surface */}
                <path d="M16,6 L6,12 L16,18 L26,12 L16,6 Z" fill="#F9FAFB" />
                
                {/* Tassel */}
                <path d="M16,20 L16,26 L18,26 L18,20 L16,20 Z" fill="#F59E0B" />
                
                {/* Mortarboard */}
                <path d="M9,13 L9,18 L23,18 L23,13 L16,17 L9,13 Z" fill="#2563EB" />
                
                {/* Mortarboard Top */}
                <path d="M9,13 L23,13 L16,11 L9,13 Z" fill="#1E40AF" />
              </g>
            </svg>
            <span className="text-xl font-bold text-primary">EdTech Course</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link 
              href="/" 
              className="text-text-primary hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/lessons" 
              className="text-text-primary hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Lessons
            </Link>
            <Link 
              href="/resources" 
              className="text-text-primary hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Resources
            </Link>
          </nav>
          
          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* User Profile / Login Button */}
            {isAuthenticated ? (
              <UserProfile />
            ) : (
              <button 
                onClick={openLoginModal}
                className="text-sm text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
              >
                Sign In
              </button>
            )}
            
            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-text-secondary hover:bg-bg-secondary focus:outline-none"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-border-light">
            <nav className="flex flex-col space-y-1">
              <Link 
                href="/" 
                className="text-text-primary hover:bg-bg-secondary px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/lessons" 
                className="text-text-primary hover:bg-bg-secondary px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Lessons
              </Link>
              <Link 
                href="/resources" 
                className="text-text-primary hover:bg-bg-secondary px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Resources
              </Link>
            </nav>
          </div>
        )}
      </div>
      
      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-neutral-dark bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="relative bg-bg-primary rounded-lg shadow-lg p-4 max-w-md w-full">
            <button 
              onClick={closeLoginModal}
              className="absolute top-4 right-4 text-text-secondary hover:text-text-primary"
              aria-label="Close"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <LoginForm onSuccess={closeLoginModal} showSignUp={true} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 