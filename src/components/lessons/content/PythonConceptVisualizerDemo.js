'use client';

import React, { useState } from 'react';
import PythonConceptVisualizer from './PythonConceptVisualizer';

const PythonConceptVisualizerDemo = () => {
  const [activeTab, setActiveTab] = useState('classes');

  const tabs = [
    { id: 'functions', label: 'Function Evolution' },
    { id: 'classes', label: 'Class Evolution' },
    { id: 'inheritance', label: 'Inheritance Evolution' }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold text-center mb-2 text-primary">Python Concept Visualizers</h2>
      <p className="text-center text-text-secondary mb-8">
        Interactive visualizations to help understand the progression of key Python concepts
      </p>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-1 p-1 bg-bg-secondary rounded-lg">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`px-4 py-2 rounded-md transition-all font-medium ${
                activeTab === tab.id 
                  ? 'bg-primary text-text-inverse shadow-sm' 
                  : 'text-text-secondary hover:text-primary'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mt-4">
        {activeTab === 'functions' && (
          <div className="space-y-4">
            <p className="text-text-secondary mb-4">
              Functions in Python evolve from simple implementations to more sophisticated versions
              that can handle variable numbers of arguments and keyword arguments. This visualization shows that progression.
            </p>
            <PythonConceptVisualizer conceptType="functions" />
          </div>
        )}
        
        {activeTab === 'classes' && (
          <div className="space-y-4">
            <p className="text-text-secondary mb-4">
              Classes represent a progression from primitive data organization with separate variables, 
              to functions that operate on related data as parameters, 
              and finally to proper classes that combine data and behavior into cohesive objects.
            </p>
            <PythonConceptVisualizer conceptType="classes" />
          </div>
        )}
        
        {activeTab === 'inheritance' && (
          <div className="space-y-4">
            <p className="text-text-secondary mb-4">
              Inheritance builds on classes by allowing for code reuse and specialization.
              This visualization shows the progression from single classes to inheritance hierarchies
              and polymorphism.
            </p>
            <PythonConceptVisualizer conceptType="inheritance" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PythonConceptVisualizerDemo; 