'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CourseProgress = () => {
  const [progress, setProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchProgress();
  }, []);
  
  const fetchProgress = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/data/user-progress.json');
      const data = await response.json();
      
      // Add a small delay to simulate loading
      setTimeout(() => {
        setProgress(data);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching progress:', error);
      setIsLoading(false);
    }
  };
  
  return (
    <section className="py-12 bg-bg-accent">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Your Progress</h2>
          <p className="text-text-secondary">Track your course progress and achievements</p>
        </div>
        
        {isLoading ? (
          <div className="bg-bg-primary rounded-lg shadow-light p-8 animate-pulse">
            <div className="h-4 bg-bg-secondary rounded w-1/4 mb-6"></div>
            <div className="h-8 bg-bg-secondary rounded mb-8"></div>
            <div className="h-24 bg-bg-secondary rounded mb-6"></div>
            <div className="h-16 bg-bg-secondary rounded"></div>
          </div>
        ) : progress ? (
          <div className="bg-bg-primary rounded-lg shadow-light overflow-hidden">
            <div className="grid md:grid-cols-2 gap-6 p-6">
              {/* Main Progress */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Course Completion</h3>
                  <div className="relative pt-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-xs font-semibold inline-block text-text-primary">
                          {progress.overallProgress}% Complete
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-text-secondary">
                          {progress.completedModules}/{progress.totalModules} Modules
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-bg-secondary">
                      <div 
                        style={{ width: `${progress.overallProgress}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"
                        aria-valuenow={progress.overallProgress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        role="progressbar"
                      ></div>
                    </div>
                    <div className="text-xs text-text-secondary">
                      <span>{progress.completedLessons} of {progress.totalLessons} lessons completed</span>
                    </div>
                  </div>
                </div>
                
                {/* Next Up */}
                <div className="border border-border-light rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-text-secondary mb-2">Continue Learning</h4>
                  <h3 className="text-lg font-semibold text-text-primary mb-1">{progress.nextLesson.title}</h3>
                  <p className="text-sm text-text-secondary mb-3">{progress.nextLesson.module}</p>
                  <div className="flex items-center text-text-secondary text-sm mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{progress.nextLesson.estimatedTime} minutes</span>
                  </div>
                  <Link 
                    href={`/lessons/${progress.nextLesson.id}`}
                    className="inline-block px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-primary-dark transition-colors"
                  >
                    Continue
                  </Link>
                </div>
              </div>
              
              {/* Achievements */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Achievements</h3>
                <div className="grid grid-cols-2 gap-3">
                  {progress.achievements.map((achievement) => (
                    <div 
                      key={achievement.id}
                      className={`border rounded-lg p-3 ${achievement.earned ? 'border-primary bg-primary/5' : 'border-border-light bg-bg-secondary opacity-70'}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div>
                          <h4 className="font-semibold text-text-primary text-sm">{achievement.title}</h4>
                          <p className="text-text-secondary text-xs mt-1">
                            {achievement.description}
                          </p>
                          {achievement.earned && (
                            <p className="text-primary text-xs mt-2">
                              Earned on {new Date(achievement.date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-bg-secondary px-6 py-3 border-t border-border-light">
              <Link
                href="/profile"
                className="text-primary hover:text-primary-dark transition-colors font-medium text-sm flex items-center justify-center md:justify-end"
              >
                <span>View Detailed Progress</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-bg-primary rounded-lg shadow-light p-8 text-center">
            <p className="text-text-secondary">
              Sign in to track your progress and access your personalized learning dashboard.
            </p>
            <div className="mt-4">
              <Link 
                href="/login"
                className="inline-block px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-primary-dark transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CourseProgress; 