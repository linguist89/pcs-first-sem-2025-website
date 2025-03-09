'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const LessonsPage = () => {
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  
  useEffect(() => {
    fetchLessons();
  }, []);
  
  const fetchLessons = async () => {
    try {
      // Fetch lessons from our API endpoint that reads markdown files
      const response = await fetch('/api/lessons');
      const data = await response.json();
      
      setLessons(data);
      
      // Extract unique modules
      const uniqueModules = [...new Set(data.map(lesson => lesson.module))];
      setModules(uniqueModules);
      
      // Set default selected module
      if (uniqueModules.length > 0) {
        setSelectedModule(uniqueModules[0]);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      setIsLoading(false);
    }
  };
  
  // Filter lessons by selected module
  const filteredLessons = selectedModule
    ? lessons.filter(lesson => lesson.module === selectedModule)
    : lessons;
  
  return (
    <main className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Lessons</h1>
        <p className="text-text-secondary mb-8">Browse our course content and begin your learning journey</p>
        
        {/* Module Selection */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedModule(null)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedModule === null
                  ? 'bg-primary text-white'
                  : 'bg-bg-secondary text-text-primary hover:bg-bg-accent'
              }`}
            >
              All Modules
            </button>
            
            {modules.map((module, index) => (
              <button
                key={index}
                onClick={() => setSelectedModule(module)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedModule === module
                    ? 'bg-primary text-white'
                    : 'bg-bg-secondary text-text-primary hover:bg-bg-accent'
                }`}
              >
                {module}
              </button>
            ))}
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-64 bg-bg-secondary animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/lessons/${lesson.id}`}
                className="group bg-bg-primary rounded-lg overflow-hidden shadow-light hover:shadow-medium transition-shadow border border-border-light"
              >
                {/* Lesson Image */}
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={lesson.image}
                    alt={lesson.title}
                    width={500}
                    height={300}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Module Tag */}
                  <div className="absolute top-2 left-2">
                    <div className="bg-primary text-white text-xs px-2 py-1 rounded-md">
                      {lesson.module}
                    </div>
                  </div>
                  
                  {/* Duration */}
                  <div className="absolute bottom-2 right-2">
                    <div className="bg-bg-primary bg-opacity-80 text-text-primary text-xs px-2 py-1 rounded-md flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {lesson.duration} min
                    </div>
                  </div>
                </div>
                
                {/* Lesson Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-text-primary mb-1 group-hover:text-primary transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                    {lesson.description}
                  </p>
                  
                  {/* Progress */}
                  {lesson.progress > 0 && (
                    <div className="mt-auto">
                      <div className="flex justify-between items-center text-xs text-text-secondary mb-1">
                        <span>{lesson.progress}% complete</span>
                      </div>
                      <div className="h-1.5 w-full bg-bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${lesson.progress}%` }}
                          aria-valuenow={lesson.progress}
                          aria-valuemin="0"
                          aria-valuemax="100"
                          role="progressbar"
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {filteredLessons.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-text-secondary">No lessons found. Please select a different module.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default LessonsPage; 