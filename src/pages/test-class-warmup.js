'use client';

import { useState, useEffect } from 'react';
import LessonRenderer from '../components/lessons/LessonRenderer';

export default function TestClassWarmup() {
  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        const response = await fetch('/data/Lessons/json/03-introduction-to-classes-modified.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch lesson data: ${response.status}`);
        }
        const data = await response.json();
        setLessonData(data);
      } catch (err) {
        console.error('Error loading lesson data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLessonData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Class Warmup Test Page</h1>
      
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading lesson content...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <p><strong>Error:</strong> {error}</p>
          <p className="mt-2">Please check the console for more details.</p>
        </div>
      )}
      
      {lessonData && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">{lessonData.title}</h2>
            <p className="text-gray-600 mb-4">{lessonData.description}</p>
            
            <div className="mt-8">
              <LessonRenderer content={lessonData.content} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 