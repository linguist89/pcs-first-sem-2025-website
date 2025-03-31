'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';

// For testing only - set to true to enable admin mode without authentication
const AUTO_ADMIN_MODE = false;

const Exercise = ({ 
  title, 
  instructions, 
  starterCode, 
  solution,
  language = 'python',
  difficulty = 'intermediate',
  id,
  isAdmin = false,
  isChallenge = false,
  passwordProtected = false,
  solutionPassword = ''
}) => {
  const [showSolution, setShowSolution] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordRequired, setIsPasswordRequired] = useState(passwordProtected);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminPassword, setAdminPassword] = useState(solutionPassword);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Use the auto admin mode or passed isAdmin prop
  const effectiveIsAdmin = AUTO_ADMIN_MODE || isAdmin;
  
  const exerciseId = id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  // Effect to initialize password state when component mounts
  useEffect(() => {
    // If we have direct props, use them
    setIsPasswordRequired(passwordProtected);
    
    // If password is not required, user can see solution
    if (!passwordProtected) {
      setIsPasswordCorrect(true);
    }
    
    // For debugging only
    console.log(`Exercise ${exerciseId}: passwordProtected=${passwordProtected}, hasPassword=${!!solutionPassword}`);
  }, [passwordProtected, solutionPassword, exerciseId]);
  
  useEffect(() => {
    // Only run API check if passwordProtected isn't specified via props
    if (passwordProtected === false) {
      // Check if this exercise has a password requirement via API
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
    }
  }, [exerciseId, passwordProtected]);
  
  // Fetch the current password for admin panel if admin mode is active
  useEffect(() => {
    if (effectiveIsAdmin && showAdminPanel) {
      // If we already have the solutionPassword prop, use it
      if (solutionPassword) {
        setAdminPassword(solutionPassword);
        return;
      }
      
      // Otherwise fetch from API
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
  }, [effectiveIsAdmin, showAdminPanel, exerciseId, solutionPassword]);
  
  const difficultyClasses = {
    beginner: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
    intermediate: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    advanced: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'
  };
  
  const difficultyClass = difficultyClasses[difficulty.toLowerCase()] || difficultyClasses.intermediate;
  
  // Determine border color based on whether this is an exercise or challenge
  const borderClass = isChallenge ? 'border-purple-500 dark:border-purple-400' : 'border-blue-500 dark:border-blue-400';
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwordInput.trim()) {
      setPasswordError('Please enter a password');
      return;
    }
    
    try {
      // If we have the solution password prop, verify directly
      if (solutionPassword) {
        if (passwordInput === solutionPassword) {
          setIsPasswordCorrect(true);
          setPasswordError('');
          setShowSolution(true);
        } else {
          setPasswordError('Incorrect password. Please try again.');
        }
        return;
      }
      
      // Otherwise verify via API
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
      className={`bg-[var(--card-bg)] rounded-lg shadow-md p-6 mb-6 border-l-4 ${borderClass} border border-[var(--card-border)]`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-[var(--text-primary)]">
          {isChallenge ? '🏆 ' : ''}{title || (isChallenge ? 'Challenge' : 'Exercise')}
        </h3>
        <div className="flex items-center space-x-2">
          {isChallenge && (
            <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800 text-sm rounded-full px-3 py-1 font-medium border mr-2">
              Challenge
            </span>
          )}
          <span className={`${difficultyClass} text-sm rounded-full px-3 py-1 font-medium border`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
        </div>
      </div>
      
      {/* Admin panel for password management */}
      {effectiveIsAdmin && showAdminPanel && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mb-6 p-4 bg-[var(--background-secondary)] border border-[var(--border-light)] rounded-lg"
        >
          <h4 className="text-md font-medium text-[var(--text-primary)] mb-2">Solution Password Management</h4>
          
          {successMessage && (
            <div className="mb-3 p-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md text-sm">
              {successMessage}
            </div>
          )}
          
          <p className="text-sm text-[var(--text-secondary)] mb-3">
            {isPasswordRequired ? 
              `Current status: Password protected (ID: ${exerciseId})` : 
              `Current status: No password required (ID: ${exerciseId})`
            }
          </p>
          
          <form onSubmit={handleAdminPasswordUpdate} className="space-y-3">
            <div>
              <label htmlFor="adminPassword" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                {isPasswordRequired ? 'Update Password' : 'Set Password'} (leave empty to remove)
              </label>
              <input
                type="text"
                id="adminPassword"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder={isPasswordRequired ? "Change or clear password" : "Set password for this exercise"}
                className="w-full px-3 py-2 border border-[var(--border-light)] bg-[var(--card-bg)] text-[var(--text-primary)] rounded-md text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-md hover:opacity-90 transition-opacity text-sm font-medium"
            >
              {adminPassword ? 'Save Password' : 'Remove Password'}
            </button>
          </form>
        </motion.div>
      )}
      
      <div className="prose prose-sm dark:prose-invert max-w-none text-[var(--text-primary)] mb-4">
        <ReactMarkdown>
          {instructions}
        </ReactMarkdown>
      </div>
      
      {starterCode && (
        <div className="mb-6">
          <div className="text-sm font-medium text-[var(--text-primary)] mb-2">Starter Code:</div>
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
              className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors text-sm font-medium flex items-center"
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
                className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors text-sm font-medium flex items-center"
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
                  className="mt-4 p-4 bg-[var(--background-secondary)] border border-[var(--border-light)] rounded-lg"
                >
                  <h4 className="text-md font-medium text-[var(--text-primary)] mb-2">Password Required</h4>
                  <p className="text-sm text-[var(--text-secondary)] mb-3">
                    This solution requires a password. Please enter it below.
                  </p>
                  
                  <form onSubmit={handlePasswordSubmit} className="space-y-3">
                    <div>
                      <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="Enter password"
                        className="w-full px-3 py-2 border border-[var(--border-light)] bg-[var(--card-bg)] text-[var(--text-primary)] rounded-md text-sm"
                      />
                      {passwordError && (
                        <p className="text-red-500 dark:text-red-400 text-xs mt-1">{passwordError}</p>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-md hover:opacity-90 transition-opacity text-sm font-medium"
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
                  <div className="text-sm font-medium text-[var(--text-primary)] mb-2">Solution:</div>
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