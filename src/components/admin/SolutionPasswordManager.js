'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SolutionPasswordManager = () => {
  const [passwords, setPasswords] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newExerciseId, setNewExerciseId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Fetch the current passwords
  useEffect(() => {
    const fetchPasswords = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/admin/solution-passwords');
        if (response.ok) {
          const data = await response.json();
          setPasswords(data.passwords || {});
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to load passwords');
        }
      } catch (error) {
        setError('Error loading passwords: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPasswords();
  }, []);
  
  // Add or update a password
  const handleAddPassword = async (e) => {
    e.preventDefault();
    
    if (!newExerciseId.trim() || !newPassword.trim()) {
      setError('Exercise ID and password are required');
      return;
    }
    
    try {
      const response = await fetch('/api/admin/solution-passwords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exerciseId: newExerciseId.trim(),
          password: newPassword.trim()
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setPasswords(data.passwords || {});
        setNewExerciseId('');
        setNewPassword('');
        setError(null);
        
        // Show success message briefly
        setSuccessMessage('Password updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update password');
      }
    } catch (error) {
      setError('Error updating password: ' + error.message);
    }
  };
  
  // Remove a password
  const handleRemovePassword = async (exerciseId) => {
    try {
      const response = await fetch('/api/admin/solution-passwords', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ exerciseId }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setPasswords(data.passwords || {});
        setError(null);
        
        // Show success message briefly
        setSuccessMessage('Password removed successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to remove password');
      }
    } catch (error) {
      setError('Error removing password: ' + error.message);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Solution Password Manager</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mb-4 p-3 bg-green-100 text-green-700 rounded-md"
        >
          {successMessage}
        </motion.div>
      )}
      
      {/* Add Password Form */}
      <form onSubmit={handleAddPassword} className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-3">Add or Update Password</h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="exerciseId" className="block text-sm font-medium text-gray-700 mb-1">
              Exercise ID
            </label>
            <input
              type="text"
              id="exerciseId"
              value={newExerciseId}
              onChange={(e) => setNewExerciseId(e.target.value)}
              placeholder="example-exercise-1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Use a consistent ID format like 'week1-exercise2'
            </p>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="text"
              id="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Save Password
        </button>
      </form>
      
      {/* Current Passwords */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Current Passwords</h4>
        
        {loading ? (
          <p className="text-gray-500">Loading passwords...</p>
        ) : Object.keys(passwords).length === 0 ? (
          <p className="text-gray-500">No passwords have been set yet.</p>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exercise ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Password
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(passwords).map(([exerciseId, password]) => (
                  <tr key={exerciseId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {exerciseId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {password}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setNewExerciseId(exerciseId);
                          setNewPassword(password);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRemovePassword(exerciseId)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolutionPasswordManager; 