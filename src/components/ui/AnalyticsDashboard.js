'use client';

import { useState, useEffect } from 'react';
import { getAnalyticsData } from '@/lib/analytics';
import { useUser } from '@/context/UserContext';

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');
  
  const { user } = useUser();
  
  useEffect(() => {
    // Only show analytics for instructors
    if (user?.role !== 'instructor') {
      return;
    }
    
    const loadAnalytics = () => {
      try {
        const data = getAnalyticsData();
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAnalytics();
    
    // Refresh analytics every 30 seconds
    const interval = setInterval(loadAnalytics, 30000);
    
    return () => clearInterval(interval);
  }, [user]);
  
  // If user is not instructor, don't show analytics
  if (!user || user.role !== 'instructor') {
    return null;
  }
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Analytics Dashboard</h2>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="h-40 bg-gray-200 rounded mb-4"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (!analyticsData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Analytics Dashboard</h2>
        <p className="text-gray-500">No analytics data available.</p>
      </div>
    );
  }
  
  const { summary } = analyticsData;
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Analytics Dashboard</h2>
      
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`pb-2 px-4 ${
            activeTab === 'summary'
              ? 'border-b-2 border-primary-color text-primary-color'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('summary')}
        >
          Summary
        </button>
        <button
          className={`pb-2 px-4 ${
            activeTab === 'pageViews'
              ? 'border-b-2 border-primary-color text-primary-color'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('pageViews')}
        >
          Page Views
        </button>
        <button
          className={`pb-2 px-4 ${
            activeTab === 'lessons'
              ? 'border-b-2 border-primary-color text-primary-color'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('lessons')}
        >
          Lessons
        </button>
      </div>
      
      {/* Summary Tab */}
      {activeTab === 'summary' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total Events</h3>
              <p className="text-2xl font-bold">{summary.totalEvents}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Page Views</h3>
              <p className="text-2xl font-bold">{summary.pageViews.total}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Interactions</h3>
              <p className="text-2xl font-bold">{summary.interactions.total}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Time Frame</h3>
            <p className="text-sm text-gray-500">
              From: <span className="font-medium">{formatDate(summary.timeframe.start)}</span>
            </p>
            <p className="text-sm text-gray-500">
              To: <span className="font-medium">{formatDate(summary.timeframe.end)}</span>
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Lesson Progress</h3>
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-medium">{summary.lessonProgress.uniqueLessons}</span> unique 
              lessons accessed with <span className="font-medium">{summary.lessonProgress.total}</span> progress updates
            </p>
          </div>
        </div>
      )}
      
      {/* Page Views Tab */}
      {activeTab === 'pageViews' && (
        <div>
          <h3 className="text-lg font-medium mb-4">Page View Distribution</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page
                  </th>
                  <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.entries(summary.pageViews.byPage).map(([page, count]) => (
                  <tr key={page}>
                    <td className="py-2 px-4 text-sm">{page || 'Home'}</td>
                    <td className="py-2 px-4 text-sm font-medium">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Lessons Tab */}
      {activeTab === 'lessons' && (
        <div>
          <h3 className="text-lg font-medium mb-4">Lesson Engagement</h3>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Total Lesson Progress Updates</span>
              <span className="text-sm font-semibold">{summary.lessonProgress.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Unique Lessons Accessed</span>
              <span className="text-sm font-semibold">{summary.lessonProgress.uniqueLessons}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 italic">
            More detailed lesson analytics would be available in a full implementation,
            including time spent per lesson, completion rates, and quiz scores.
          </p>
        </div>
      )}
    </div>
  );
} 