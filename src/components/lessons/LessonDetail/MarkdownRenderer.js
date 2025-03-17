'use client';

import React from 'react';
import Image from 'next/image';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import FullScreenCode from './FullScreenCode';

// Markdown components to handle different markdown elements
const MarkdownComponents = {
  // Custom wrapper component
  wrapper: ({ children }) => <>{children}</>,
  
  // Override h1 tag for main headers (like "Scenario")
  h1: ({node, ...props}) => (
    <h1 className="text-2xl font-bold text-text-primary mb-4 mt-8 border-b pb-2 border-primary" {...props} />
  ),
  
  // Override h2 tag to handle section headers (like "Objectives")
  h2: ({node, ...props}) => (
    <h2 className="text-xl font-bold text-text-primary mb-4 mt-8" {...props} />
  ),
  
  // Override h3 tag for subsections (like difficulty levels)
  h3: ({node, ...props}) => (
    <h3 className="text-lg font-bold text-text-primary mb-3 mt-6" {...props} />
  ),
  
  // Override images to prevent nesting issues
  img: ({src, alt, ...props}) => (
    <span className="block my-6">
      <Image
        src={src}
        alt={alt || ''}
        width={1000}
        height={500}
        className="w-full h-auto object-cover rounded-lg"
      />
      {alt && (
        <span className="block text-sm text-text-secondary italic mt-2">
          {alt}
        </span>
      )}
    </span>
  ),
  
  // Override links with proper external link handling
  a: ({node, href, children, ...props}) => {
    const isExternal = href && href.startsWith('http');
    return (
      <a 
        href={href}
        className="text-primary hover:underline"
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
      </a>
    );
  },
  
  // Override paragraph to handle special formatting
  p: ({node, children, ...props}) => {
    // Check if this paragraph contains highlighted text (with [n ...])
    const text = String(children);
    if (text.includes('[') && text.includes(']')) {
      // Process the highlighted text - replace [n text] with highlighted spans
      const processedText = React.Children.map(children, child => {
        if (typeof child !== 'string') return child;
        
        // Create parts using regex to find [n text] patterns
        const parts = [];
        let lastIndex = 0;
        const regex = /\[(\d+) ([^\]]+)\]/g;
        let match;
        
        while ((match = regex.exec(child)) !== null) {
          // Add text before the match
          if (match.index > lastIndex) {
            parts.push(child.substring(lastIndex, match.index));
          }
          
          // Add the highlighted part with number
          const number = match[1];
          const highlightedText = match[2];
          parts.push(
            <span key={match.index} className="relative group cursor-pointer">
              <span className="inline-block bg-primary bg-opacity-20 text-text-primary rounded px-1 py-0.5">
                {highlightedText}
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {number}
                </span>
              </span>
            </span>
          );
          
          lastIndex = match.index + match[0].length;
        }
        
        // Add any remaining text
        if (lastIndex < child.length) {
          parts.push(child.substring(lastIndex));
        }
        
        return parts;
      });
      
      return <p className="my-4" {...props}>{processedText}</p>;
    }
    
    // Regular paragraph
    return <p className="my-4" {...props}>{children}</p>;
  },
  
  // Override lists
  ul: ({node, ...props}) => (
    <ul className="list-disc pl-6 my-4 space-y-2" {...props} />
  ),
  
  ol: ({node, ...props}) => (
    <ol className="list-decimal pl-6 my-4 space-y-2" {...props} />
  ),
  
  // Override list items to handle questions, hints, and answers
  li: ({node, children, ...props}) => {
    const text = String(children);
    
    // Check if this is a question/hint/answer item
    if (text.startsWith('**Question:**') || 
        text.startsWith('**Hint:**') || 
        text.startsWith('**Answer:**') ||
        text.startsWith('**Related:**')) {
      
      let backgroundColor = 'bg-gray-100';
      let borderColor = 'border-gray-300';
      let icon = null;
      
      if (text.startsWith('**Question:**')) {
        backgroundColor = 'bg-blue-50';
        borderColor = 'border-blue-200';
        icon = '❓';
      } else if (text.startsWith('**Hint:**')) {
        backgroundColor = 'bg-yellow-50';
        borderColor = 'border-yellow-200';
        icon = '💡';
      } else if (text.startsWith('**Answer:**')) {
        backgroundColor = 'bg-green-50';
        borderColor = 'border-green-200';
        icon = '✅';
      } else if (text.startsWith('**Related:**')) {
        backgroundColor = 'bg-purple-50';
        borderColor = 'border-purple-200';
        icon = '🔄';
      }
      
      return (
        <li className={`my-2 ${backgroundColor} border-l-4 ${borderColor} p-3 rounded-r`} {...props}>
          <div className="flex items-start">
            <span className="mr-2 text-lg">{icon}</span>
            <span>{children}</span>
          </div>
        </li>
      );
    }
    
    return <li className="my-1" {...props}>{children}</li>;
  },
  
  // Override blockquote for important notes
  blockquote: ({node, ...props}) => (
    <blockquote className="border-l-4 border-primary pl-4 italic my-6 text-text-secondary" {...props} />
  ),
  
  // Override strong for better emphasis
  strong: ({node, ...props}) => (
    <strong className="font-bold text-text-primary" {...props} />
  ),
  
  // Override code blocks to render syntax highlighting
  code: ({node, inline, className, children, ...props}) => {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    
    if (inline) {
      return (
        <code className="bg-code-bg text-code-text px-1 py-0.5 rounded" {...props}>
          {children}
        </code>
      );
    }
    
    // Toggle fullscreen mode
    const toggleFullScreen = () => {
      setIsFullScreen(!isFullScreen);
    };
    
    // Handle different code content
    const codeContent = String(children).replace(/\n$/, '');
    
    return (
      <>
        {isFullScreen && (
          <FullScreenCode 
            code={codeContent} 
            language={language}
            onClose={toggleFullScreen}
          />
        )}
        <div className="relative">
          <div className="absolute right-2 top-2 flex space-x-2">
            <button
              onClick={toggleFullScreen}
              className="bg-primary text-white p-1 rounded text-xs hover:bg-primary-dark transition-colors"
              aria-label="View code in full screen"
            >
              Expand
            </button>
          </div>
          <SyntaxHighlighter
            language={language}
            style={tomorrow}
            className="rounded-md !my-4"
            customStyle={{
              padding: '1rem',
              borderRadius: '0.375rem',
              fontSize: '0.95rem',
              marginTop: '1rem',
              marginBottom: '1rem',
              backgroundColor: '#1E1E1E'
            }}
            {...props}
          >
            {codeContent}
          </SyntaxHighlighter>
        </div>
      </>
    );
  },
};

// Main MarkdownRenderer component
const MarkdownRenderer = ({ content }) => {
  return (
    <ReactMarkdown
      className="prose prose-sm md:prose-base lg:prose-lg prose-slate max-w-none"
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={MarkdownComponents}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer; 