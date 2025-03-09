'use client';

import { useState } from 'react';
import { useUser } from '@/context/UserContext';

export default function LoginForm({ onSuccess, showSignUp = false }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  
  const { login, isLoading } = useUser();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      if (isSignUp) {
        // In a real app, we would have a signup function
        setError('Sign up functionality is not implemented in this demo');
        return;
      }
      
      // For demo, we only support these test accounts
      if (!['contact@spsdigitaltech.com'].includes(email)) {
        setError('Demo account: contact@spsdigitaltech.com');
        return;
      }
      
      await login(email, password);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    }
  };
  
  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
  };
  
  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isSignUp ? 'Create an Account' : 'Sign In'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-color"
            placeholder="you@example.com"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-color"
            placeholder={isSignUp ? 'Create a password' : 'Enter your password'}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? 'Please wait...'
            : isSignUp
              ? 'Create Account'
              : 'Sign In'}
        </button>
      </form>
      
      {showSignUp && (
        <div className="mt-4 text-center">
          <button onClick={toggleMode} className="text-primary hover:underline">
            {isSignUp
              ? 'Already have an account? Sign in'
              : 'Need an account? Sign up'}
          </button>
        </div>
      )}
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>For demo purposes, use this account:</p>
        <ul className="mt-2">
          <li><strong>contact@spsdigitaltech.com</strong></li>
        </ul>
        <p className="mt-2">Any password will work</p>
      </div>
    </div>
  );
} 