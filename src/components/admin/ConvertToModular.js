'use client';

import { useState, useEffect } from 'react';

/**
 * Component for converting JSON lessons to modular lessons with separate markdown files
 */
const ConvertToModular = () => {
  const [isConverting, setIsConverting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState('');
  const [lessons, setLessons] = useState([]);
  
  // Fetch available JSON lessons
  const fetchLessons = async () => {
    try {
      const response = await fetch('/api/lessons');
      const data = await response.json();
      
      // Filter to only get JSON format lessons
      const jsonLessons = data.filter(lesson => lesson.format === 'json');
      setLessons(jsonLessons);
      setError(null);
    } catch (err) {
      setError('Failed to fetch lessons: ' + err.message);
    }
  };
  
  // Load lessons on mount
  useEffect(() => {
    fetchLessons();
  }, []);
  
  // Convert the selected lesson to modular format
  const handleConvert = async () => {
    if (!selectedLesson) {
      setError('Please select a lesson to convert');
      return;
    }
    
    setIsConverting(true);
    setResult(null);
    setError(null);
    
    try {
      const response = await fetch(`/api/admin/convert-to-modular?id=${selectedLesson}`, {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to convert lesson');
      }
      
      setResult(data);
    } catch (err) {
      setError('Error converting lesson: ' + err.message);
    } finally {
      setIsConverting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Convert Lesson to Modular Format</h2>
      
      <p className="text-gray-600 mb-4">
        Convert a JSON lesson to a modular format with separate markdown files for each section.
        This makes it easier to edit individual parts of the lesson.
      </p>
      
      <div className="mb-4">
        <label htmlFor="lesson-select" className="block text-sm font-medium text-gray-700 mb-1">
          Select Lesson
        </label>
        <select
          id="lesson-select"
          value={selectedLesson}
          onChange={(e) => setSelectedLesson(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          disabled={isConverting}
        >
          <option value="">Select a lesson to convert</option>
          {lessons.map((lesson) => (
            <option key={lesson.id} value={lesson.id}>
              {lesson.id}: {lesson.title}
            </option>
          ))}
        </select>
      </div>
      
      <button
        onClick={handleConvert}
        disabled={isConverting || !selectedLesson}
        className={`px-4 py-2 rounded-md text-white ${
          isConverting || !selectedLesson
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isConverting ? 'Converting...' : 'Convert to Modular'}
      </button>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-300 text-red-800 rounded-md">
          {error}
        </div>
      )}
      
      {result && (
        <div className="mt-4 p-3 bg-green-50 border border-green-300 text-green-800 rounded-md">
          <p className="font-medium">Conversion Successful!</p>
          <p className="mt-1">The lesson has been converted to modular format.</p>
          <p className="mt-2">
            <strong>Location:</strong> {result.path}
          </p>
          <p className="mt-1">
            <strong>Sections:</strong> {result.sectionCount} markdown files created
          </p>
        </div>
      )}
    </div>
  );
};

export default ConvertToModular; 