'use client';

import React from 'react';
import CodeSliderExample from '@/components/lessons/content/CodeSliderExample';

export default function CodeSliderDemo() {
  return (
    <div className="container mx-auto max-w-4xl p-4 py-8">
      <h1 className="text-3xl font-bold mb-6">CodeSlider Component Demo</h1>
      <p className="mb-8">
        This page demonstrates the CodeSlider component, which creates an interactive learning journey
        showing the evolution of code from messy to structured formats. The component guides the user's
        attention by focusing on specific code blocks and showing targeted explanations.
      </p>
      
      <CodeSliderExample />
      
      <div className="mt-12 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Creating Block-Focused Learning Journeys</h2>
        <p className="mb-4">
          The CodeSlider component now features a block-focused approach that helps users understand 
          code step by step, with each comment-prefixed block highlighted while others are blurred:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Comment-Based Block Detection</h3>
            <p className="text-gray-700 mb-2">
              The component automatically detects code blocks based on comments, creating focused sections.
            </p>
            <div className="flex justify-center mt-3">
              <div className="bg-slate-800 text-white p-3 rounded-md max-w-xs text-sm">
                <pre className="text-green-300 font-bold"># Comment starts a new block</pre>
                <pre className="text-white">code_line_1</pre>
                <pre className="text-white">code_line_2</pre>
                <pre className="opacity-50 blur-[1px]"># Next comment starts next block</pre>
                <pre className="opacity-50 blur-[1px]">code_line_3</pre>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Block-Specific Explanations</h3>
            <p className="text-gray-700 mb-2">
              Each code block can have its own targeted explanation for deeper understanding.
            </p>
            <div className="flex justify-center mt-3">
              <div className="bg-slate-800 text-white p-3 rounded-md max-w-xs text-sm">
                <pre className="font-bold text-yellow-300">blockExplanations: [</pre>
                <pre>  "Explanation for first block",</pre>
                <pre>  "Explanation for second block",</pre>
                <pre>  "Explanation for third block"</pre>
                <pre className="font-bold text-yellow-300">]</pre>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Sequential Navigation</h3>
            <p className="text-gray-700 mb-2">
              Users progress through each block in sequence before moving to the next slide.
            </p>
            <div className="flex justify-center mt-3">
              <div className="flex space-x-12 items-center">
                <button className="bg-blue-600 text-white px-3 py-1.5 rounded-md font-medium flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                <button className="bg-blue-600 text-white px-3 py-1.5 rounded-md font-medium flex items-center text-sm">
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Visual Focus</h3>
            <p className="text-gray-700 mb-2">
              Current block is highlighted while other blocks are blurred for enhanced focus.
            </p>
            <div className="flex justify-center mt-3">
              <div className="bg-slate-800 text-white p-3 rounded-md max-w-xs text-sm text-left">
                <pre className="filter blur-[1px] opacity-50">// Blurred code block</pre>
                <pre className="filter blur-[1px] opacity-50">const a = 1;</pre>
                <pre className="border-l-4 border-green-400 pl-2 filter brightness-125">// Focused code block</pre>
                <pre className="border-l-4 border-green-400 pl-2 filter brightness-125">const b = 2;</pre>
                <pre className="filter blur-[1px] opacity-50">// Another blurred block</pre>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm col-span-full">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Complete Example</h3>
            <p className="text-gray-700 mb-2">
              Combine block detection with specific explanations for a comprehensive learning experience.
            </p>
            <pre className="bg-gray-800 text-white p-3 rounded-md overflow-x-auto text-sm">
{`{
  "type": "codeSlider",
  "slides": [
    {
      "code": "# First code block\\nconst a = 1;\\n\\n# Second code block\\nconst b = 2;",
      "blockExplanations": [
        "This is the explanation for the first block",
        "This is the explanation for the second block"
      ]
    }
  ]
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
} 