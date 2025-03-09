'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { 
  signIn, 
  signOut, 
  getCurrentUser, 
  updateUserProgress 
} from '@/lib/auth';

// Initial user context state
const initialState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  login: async () => {},
  logout: async () => {},
  updateProgress: async () => {}
};

// Create context
const UserContext = createContext(initialState);

// Custom hook for accessing user context
export const useUser = () => useContext(UserContext);

// User provider component
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check for existing user session
  useEffect(() => {
    const checkUser = () => {
      try {
        const currentUser = getCurrentUser();
        setUser(currentUser);
        setIsLoading(false);
      } catch (err) {
        console.error('Error checking user session:', err);
        setIsLoading(false);
        setError('Error loading user session');
      }
    };
    
    checkUser();
  }, []);
  
  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = await signIn(email, password);
      setUser(user);
      return user;
    } catch (err) {
      setError(err.message || 'Failed to sign in');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = async () => {
    setIsLoading(true);
    
    try {
      await signOut();
      setUser(null);
    } catch (err) {
      setError(err.message || 'Failed to sign out');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update user progress
  const updateProgress = async (lessonId, isCompleted = true) => {
    if (!user) {
      setError('User not authenticated');
      throw new Error('User not authenticated');
    }
    
    try {
      const updatedUser = await updateUserProgress(user.id, lessonId, isCompleted);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message || 'Failed to update progress');
      throw err;
    }
  };
  
  // Context value
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login,
    logout,
    updateProgress
  };
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
} 