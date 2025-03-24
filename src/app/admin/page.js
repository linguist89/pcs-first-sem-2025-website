'use client';

import { useState } from 'react';
import Link from 'next/link';
import ConvertToModular from '@/components/admin/ConvertToModular';
import LessonEditor from '@/components/admin/LessonEditor';
import SolutionPasswordManager from '@/components/admin/SolutionPasswordManager';

/**
 * Admin page component with various admin tools
 */
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('lessons');
  
  // Tabs configuration
  const tabs = [
    { id: 'lessons', label: 'Edit Lessons' },
    { id: 'convert', label: 'Convert Lessons' },
    { id: 'manage', label: 'Manage Lessons' },
    { id: 'passwords', label: 'Solution Passwords' },
  ];
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <Link 
          href="/" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
      
      {/* Tabs navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Tab content */}
      <div>
        {activeTab === 'lessons' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Lesson JSON</h2>
            <p className="text-gray-600 mb-6">
              This tool allows you to directly edit the JSON of existing lessons. 
              Make sure to maintain the correct structure as validation errors will be shown.
            </p>
            <LessonEditor />
          </div>
        )}
        
        {activeTab === 'convert' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Lesson Format Conversion</h2>
            <p className="text-gray-600 mb-6">
              This tool allows you to convert existing JSON lessons to a modular format with separate markdown files.
              The modular format makes it easier to edit lesson content without dealing with complex JSON structures.
            </p>
            <div className="space-y-6">
              <ConvertToModular />
              
              <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Convert Specific Lessons</h3>
                <p className="text-gray-600 mb-4">
                  Convert the following specific lessons to modular format:
                  <ul className="list-disc ml-6 mt-2">
                    <li>01-introduction-to-functions</li>
                    <li>02-memory-recall-experiments</li>
                  </ul>
                </p>
                <Link 
                  href="/admin/convert-lessons" 
                  className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Convert Specific Lessons
                </Link>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'manage' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Manage Lessons</h2>
            <p className="text-gray-600">
              Lesson management features coming soon.
            </p>
          </div>
        )}
        
        {activeTab === 'passwords' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Solution Password Management</h2>
            <p className="text-gray-600 mb-6">
              This tool allows you to set passwords for exercise solutions. Students will need to enter the correct password to view solutions.
            </p>
            <SolutionPasswordManager />
          </div>
        )}
      </div>
    </div>
  );
} 