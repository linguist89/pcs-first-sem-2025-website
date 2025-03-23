'use client';

import { useState } from 'react';

export default function ConvertLessonsPage() {
  const [isConverting, setIsConverting] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleConvert = async () => {
    try {
      setIsConverting(true);
      setError(null);
      setResults(null);
      
      const response = await fetch('/api/admin/convert-lessons');
      const data = await response.json();
      
      if (data.success) {
        setResults(data.results);
      } else {
        setError(data.error || 'Unknown error occurred');
      }
    } catch (err) {
      setError(err.message || 'Failed to convert lessons');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Convert Lessons to Modular Format</h1>
      
      <div className="mb-6">
        <p className="mb-4">This page will convert the following lessons to modular format:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>01-introduction-to-functions</li>
          <li>02-memory-recall-experiments</li>
        </ul>
        
        <button
          onClick={handleConvert}
          disabled={isConverting}
          className={`px-4 py-2 rounded ${
            isConverting 
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isConverting ? 'Converting...' : 'Convert Lessons'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {results && (
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-4">Conversion Results</h2>
          
          {results.map((result, index) => (
            <div 
              key={index}
              className={`mb-4 p-4 rounded ${
                result.success 
                  ? 'bg-green-100 border border-green-400' 
                  : 'bg-red-100 border border-red-400'
              }`}
            >
              <p className="font-bold">
                {result.success ? '✅ Success' : '❌ Failed'}: Lesson {result.id}
              </p>
              
              {result.success ? (
                <>
                  <p>Path: {result.path}</p>
                  <p>Sections: {result.sectionCount}</p>
                </>
              ) : (
                <p>Error: {result.error}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 