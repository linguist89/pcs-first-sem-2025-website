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
            <h3 className="text-lg font-medium text-blue-800 mb-2">Spotlight Focus</h3>
            <p className="text-gray-700 mb-2">
              Current block is highlighted with a spotlight effect while surrounding areas are dimmed.
            </p>
            <div className="flex justify-center mt-3">
              <div className="bg-slate-800 text-white p-3 rounded-md max-w-xs text-sm relative overflow-hidden">
                <div className="absolute top-0 h-8 left-0 right-0 bg-slate-900/70 backdrop-blur-[1px]"></div>
                <div className="absolute bottom-0 h-8 left-0 right-0 bg-slate-900/70 backdrop-blur-[1px]"></div>
                
                <pre className="opacity-50 blur-[1px]">// Dimmed code above</pre>
                <div className="relative border-2 border-green-400/70 my-1">
                  <pre className="brightness-125">// Spotlighted code block</pre>
                  <pre className="brightness-125">const spotlightedCode = true;</pre>
                </div>
                <pre className="opacity-50 blur-[1px]">// Dimmed code below</pre>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Toggleable Spotlight</h3>
            <p className="text-gray-700 mb-2">
              Users can disable the spotlight effect to view the entire code without dimming.
            </p>
            <div className="flex justify-center mt-3">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600 shadow rounded px-3 py-1 bg-gray-100">
                  Click to toggle spotlight on/off
                </span>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-2 text-center">
              Spotlight is automatically enabled when showing explanations
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Draggable Explanations</h3>
            <p className="text-gray-700 mb-2">
              Explanation popup can be dragged anywhere on screen and maintains its position between blocks and slides.
            </p>
            <div className="flex justify-center mt-3">
              <div className="flex flex-col items-center">
                <div className="bg-slate-800 p-3 rounded-lg border border-slate-600 text-white mb-2 relative">
                  <div className="absolute top-0 left-0 w-full h-5 bg-slate-700 rounded-t-lg">
                    <div className="flex space-x-1 px-2 py-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm">
                    <div className="text-xs text-blue-300">Explanation title</div>
                    <div className="mt-1">Drag me anywhere!</div>
                  </div>
                </div>
                <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  Position is remembered as you navigate
                </div>
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