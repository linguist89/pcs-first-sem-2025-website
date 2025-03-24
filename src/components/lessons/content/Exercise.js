'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

// For testing only - set to true to enable admin mode without authentication
const AUTO_ADMIN_MODE = true;

const Exercise = ({ 
  title, 
  instructions, 
  starterCode, 
  solution,
  language = 'python',
  difficulty = 'intermediate',
  id,
  isAdmin = false
}) => {
  const [showSolution, setShowSolution] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordRequired, setIsPasswordRequired] = useState(true);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Use the auto admin mode or passed isAdmin prop
  const effectiveIsAdmin = AUTO_ADMIN_MODE || isAdmin;
  
  const exerciseId = id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  useEffect(() => {
    // Check if this exercise has a password requirement
    const checkPasswordStatus = async () => {
      try {
        const response = await fetch('/api/solution-passwords');
        if (response.ok) {
          const data = await response.json();
          const hasPassword = data.passwords && data.passwords[exerciseId];
          setIsPasswordRequired(!!hasPassword);
          
          // If no password is required, allow showing solution
          if (!hasPassword) {
            setIsPasswordCorrect(true);
          }
        }
      } catch (error) {
        console.error('Error checking password status:', error);
      }
    };
    
    checkPasswordStatus();
  }, [exerciseId]);
  
  // Fetch the current password for admin panel if admin mode is active
  useEffect(() => {
    if (effectiveIsAdmin && showAdminPanel) {
      const fetchPassword = async () => {
        try {
          const response = await fetch('/api/admin/solution-passwords');
          if (response.ok) {
            const data = await response.json();
            if (data.passwords && data.passwords[exerciseId]) {
              setAdminPassword(data.passwords[exerciseId]);
            } else {
              setAdminPassword('');
            }
          }
        } catch (error) {
          console.error('Error fetching password:', error);
        }
      };
      
      fetchPassword();
    }
  }, [effectiveIsAdmin, showAdminPanel, exerciseId]);
  
  const difficultyClasses = {
    beginner: 'bg-green-100 text-green-800 border-green-200',
    intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    advanced: 'bg-red-100 text-red-800 border-red-200'
  };
  
  const difficultyClass = difficultyClasses[difficulty.toLowerCase()] || difficultyClasses.intermediate;
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwordInput.trim()) {
      setPasswordError('Please enter a password');
      return;
    }
    
    try {
      const response = await fetch('/api/verify-solution-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exerciseId,
          password: passwordInput
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsPasswordCorrect(true);
        setPasswordError('');
        setShowSolution(true);
      } else {
        setPasswordError('Incorrect password. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      setPasswordError('An error occurred. Please try again.');
    }
  };
  
  const handleAdminPasswordUpdate = async (e) => {
    e.preventDefault();
    
    try {
      // If admin password is empty, it means we want to remove the password
      if (!adminPassword.trim()) {
        const response = await fetch('/api/admin/solution-passwords', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ exerciseId }),
        });
        
        if (response.ok) {
          setSuccessMessage('Password removed successfully');
          setTimeout(() => setSuccessMessage(''), 3000);
          setIsPasswordRequired(false);
          setIsPasswordCorrect(true);
        }
      } else {
        // Otherwise, add or update the password
        const response = await fetch('/api/admin/solution-passwords', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            exerciseId,
            password: adminPassword
          }),
        });
        
        if (response.ok) {
          setSuccessMessage('Password updated successfully');
          setTimeout(() => setSuccessMessage(''), 3000);
          setIsPasswordRequired(true);
        }
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordError('An error occurred. Please try again.');
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-blue-500"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">{title || 'Exercise'}</h3>
        <div className="flex items-center space-x-2">
          <span className={`${difficultyClass} text-sm rounded-full px-3 py-1 font-medium border`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
          
          {effectiveIsAdmin && (
            <button
              onClick={() => setShowAdminPanel(!showAdminPanel)}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-xs"
              title="Admin options"
            >
              {showAdminPanel ? 'Hide Admin' : 'Admin'}
            </button>
          )}
        </div>
      </div>
      
      {/* Admin panel for password management */}
      {effectiveIsAdmin && showAdminPanel && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg"
        >
          <h4 className="text-md font-medium text-gray-800 mb-2">Solution Password Management</h4>
          
          {successMessage && (
            <div className="mb-3 p-2 bg-green-100 text-green-700 rounded-md text-sm">
              {successMessage}
            </div>
          )}
          
          <p className="text-sm text-gray-600 mb-3">
            {isPasswordRequired ? 
              `Current status: Password protected (ID: ${exerciseId})` : 
              `Current status: No password required (ID: ${exerciseId})`
            }
          </p>
          
          <form onSubmit={handleAdminPasswordUpdate} className="space-y-3">
            <div>
              <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 mb-1">
                {isPasswordRequired ? 'Update Password' : 'Set Password'} (leave empty to remove)
              </label>
              <input
                type="text"
                id="adminPassword"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder={isPasswordRequired ? "Change or clear password" : "Set password for this exercise"}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              {adminPassword ? 'Save Password' : 'Remove Password'}
            </button>
          </form>
        </motion.div>
      )}
      
      <div className="prose prose-sm max-w-none text-gray-700 mb-4">
        <ReactMarkdown>
          {instructions}
        </ReactMarkdown>
      </div>
      
      {starterCode && (
        <div className="mb-6">
          <div className="text-sm font-medium text-gray-700 mb-2">Starter Code:</div>
          <SyntaxHighlighter
            language={language}
            style={tomorrow}
            className="rounded-lg"
            customStyle={{
              padding: '1rem',
              fontSize: '0.95rem',
              backgroundColor: '#1E293B'
            }}
          >
            {starterCode}
          </SyntaxHighlighter>
        </div>
      )}
      
      {solution && (
        <div className="mt-6">
          {!showSolution ? (
            <button 
              onClick={() => setShowSolution(true)}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium flex items-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Show Solution
            </button>
          ) : (
            <>
              <button 
                onClick={() => setShowSolution(false)}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium flex items-center"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 mr-2 rotate-90" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Hide Solution
              </button>
              
              {isPasswordRequired && !isPasswordCorrect ? (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <h4 className="text-md font-medium text-gray-800 mb-2">Password Required</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    This solution requires a password. Please enter it below.
                  </p>
                  
                  <form onSubmit={handlePasswordSubmit} className="space-y-3">
                    <div>
                      <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="Enter password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      {passwordError && (
                        <p className="text-red-500 text-xs mt-1">{passwordError}</p>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Submit
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="mt-4"
                >
                  <div className="text-sm font-medium text-gray-700 mb-2">Solution:</div>
                  <SyntaxHighlighter
                    language={language}
                    style={tomorrow}
                    className="rounded-lg"
                    customStyle={{
                      padding: '1rem',
                      fontSize: '0.95rem',
                      backgroundColor: '#1E293B'
                    }}
                  >
                    {solution}
                  </SyntaxHighlighter>
                </motion.div>
              )}
            </>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Exercise; 