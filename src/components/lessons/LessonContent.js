'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { cn } from '@/lib/utils';
import DataDownloadButton from './DataDownloadButton';

const LessonModule = ({ section, activeSection, index }) => {
  const moduleRef = useRef(null);
  const isActive = activeSection === index;
  
  useEffect(() => {
    if (isActive && moduleRef.current) {
      moduleRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [isActive]);

  // Skip rendering if no content
  if (!section || !section.content) return null;

  // Handle different types of content
  const renderContent = () => {
    const { type, title, content } = section;
    
    // Base container styles
    const containerClasses = cn(
      "p-6 rounded-lg my-6 border border-gray-200",
      {
        "bg-blue-50 border-blue-200": type === "warmup",
        "bg-white": type === "lesson",
        "bg-green-50 border-green-200": type === "exercise",
        "bg-purple-50 border-purple-200": type === "postlesson"
      }
    );
    
    // Title styles based on section type
    const titleClasses = cn(
      "text-xl font-bold mb-4",
      {
        "text-blue-700": type === "warmup",
        "text-gray-800": type === "lesson",
        "text-green-700": type === "exercise",
        "text-purple-700": type === "postlesson"
      }
    );
    
    return (
      <div id={`section-${index}`} className={containerClasses}>
        <h2 className={titleClasses}>{title}</h2>
        <div className="prose max-w-none">
          <ReactMarkdown
            children={content}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, '')}
                    style={vs}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }
            }}
          />
        </div>
      </div>
    );
  };
  
  return (
    <section 
      ref={moduleRef}
      className={cn(
        "transition-opacity duration-300",
        isActive ? "opacity-100" : "opacity-100"
      )}
    >
      {renderContent()}
    </section>
  );
};

export default function LessonContent({ 
  sections, 
  activeSection, 
  lessonTitle,
  lessonDescription,
  lessonDifficulty,
  lessonDuration,
  dataUrl
}) {
  if (!sections || sections.length === 0) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-yellow-700 mb-2">No Content Available</h3>
          <p className="text-yellow-600">This lesson doesn't have any content sections yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{lessonTitle}</h1>
        
        <div className="flex items-center gap-3 mb-4">
          {lessonDifficulty && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {lessonDifficulty}
            </span>
          )}
          
          {lessonDuration && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {lessonDuration}
            </span>
          )}
        </div>
        
        {lessonDescription && (
          <p className="text-gray-600 mb-4">{lessonDescription}</p>
        )}
        
        {dataUrl && (
          <div className="mt-4 mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-lg font-medium text-blue-700 mb-2">Dataset for This Lesson</h3>
            <p className="text-blue-600 mb-3">
              Download the dataset you'll need for this lesson:
            </p>
            <DataDownloadButton dataUrl={dataUrl} />
          </div>
        )}
        
        <hr className="border-gray-200" />
      </div>
      
      <div>
        {sections.map((section, i) => (
          <LessonModule 
            key={i}
            section={section}
            activeSection={activeSection}
            index={i}
          />
        ))}
      </div>
    </div>
  );
} 