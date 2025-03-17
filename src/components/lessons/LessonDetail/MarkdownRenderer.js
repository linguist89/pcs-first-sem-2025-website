'use client';

import React from 'react';
import Image from 'next/image';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion } from 'framer-motion';
import FullScreenCode from './FullScreenCode';

// Markdown components to handle different markdown elements
const MarkdownComponents = {
  // Custom wrapper component
  wrapper: ({ children }) => <>{children}</>,
  
  // Override h1 tag for main headers (like "Scenario")
  h1: ({node, ...props}) => (
    <motion.h1 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="text-2xl font-bold text-[#1F2937] mb-4 mt-8 border-b pb-2 border-[#3B82F6]" 
      {...props} 
    />
  ),
  
  // Override h2 tag to handle section headers (like "Objectives")
  h2: ({node, ...props}) => (
    <motion.h2
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="text-xl font-bold text-[#1F2937] mb-4 mt-8" 
      {...props} 
    />
  ),
  
  // Override h3 tag for subsections (like difficulty levels)
  h3: ({node, ...props}) => (
    <motion.h3
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="text-lg font-bold text-[#1F2937] mb-3 mt-6" 
      {...props} 
    />
  ),
  
  // Override images to prevent nesting issues
  img: ({src, alt, ...props}) => (
    <motion.span 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="block my-6"
    >
      <Image
        src={src}
        alt={alt || ''}
        width={1000}
        height={500}
        className="w-full h-auto object-cover rounded-lg shadow-md"
      />
      {alt && (
        <span className="block text-sm text-[#4B5563] italic mt-2">
          {alt}
        </span>
      )}
    </motion.span>
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
            <motion.span 
              key={match.index} 
              initial={{ backgroundColor: "#E0F2FE" }}
              whileHover={{ backgroundColor: "#BFDBFE" }}
              className="relative group cursor-pointer"
            >
              <span className="inline-block bg-[#3B82F6] bg-opacity-10 text-[#1F2937] rounded px-1 py-0.5">
                {highlightedText}
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#3B82F6] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {number}
                </span>
              </span>
            </motion.span>
          );
          
          lastIndex = match.index + match[0].length;
        }
        
        // Add any remaining text
        if (lastIndex < child.length) {
          parts.push(child.substring(lastIndex));
        }
        
        return parts;
      });
      
      return <p className="my-4 text-[#4B5563]" {...props}>{processedText}</p>;
    }
    
    // Regular paragraph
    return <p className="my-4 text-[#4B5563]" {...props}>{children}</p>;
  },
  
  // Override lists
  ul: ({node, ...props}) => (
    <ul className="list-disc pl-6 my-4 space-y-2 text-[#4B5563]" {...props} />
  ),
  
  ol: ({node, ...props}) => (
    <ol className="list-decimal pl-6 my-4 space-y-2 text-[#4B5563]" {...props} />
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
        backgroundColor = 'bg-[#EFF6FF]';
        borderColor = 'border-[#3B82F6]';
        icon = '❓';
      } else if (text.startsWith('**Hint:**')) {
        backgroundColor = 'bg-[#FFFBEB]';
        borderColor = 'border-[#FBBF24]';
        icon = '💡';
      } else if (text.startsWith('**Answer:**')) {
        backgroundColor = 'bg-[#ECFDF5]';
        borderColor = 'border-[#10B981]';
        icon = '✅';
      } else if (text.startsWith('**Related:**')) {
        backgroundColor = 'bg-[#F5F3FF]';
        borderColor = 'border-[#8B5CF6]';
        icon = '🔄';
      }
      
      return (
        <motion.li 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className={`my-2 ${backgroundColor} border-l-4 ${borderColor} p-3 rounded-r shadow-sm`} 
          {...props}
        >
          <div className="flex items-start">
            <span className="mr-2 text-lg">{icon}</span>
            <span>{children}</span>
          </div>
        </motion.li>
      );
    }
    
    return <li className="my-1 text-[#4B5563]" {...props}>{children}</li>;
  },
  
  // Override blockquote for important notes
  blockquote: ({node, ...props}) => (
    <motion.blockquote 
      initial={{ opacity: 0, borderLeftWidth: 0 }}
      animate={{ opacity: 1, borderLeftWidth: 4 }}
      transition={{ duration: 0.5 }}
      className="border-l-4 border-[#3B82F6] pl-4 italic my-6 text-[#4B5563] bg-[#F9FAFB] p-3 rounded-r"
      {...props} 
    />
  ),
  
  // Override strong for better emphasis
  strong: ({node, ...props}) => (
    <strong className="font-bold text-[#1F2937]" {...props} />
  ),
  
  // Override code blocks to render syntax highlighting
  code: ({node, inline, className, children, ...props}) => {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    
    if (inline) {
      return (
        <code className="font-mono bg-[#EEF2FF] text-[#3B82F6] px-2 py-0.5 rounded border border-[#DBEAFE] text-sm" {...props}>
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
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="absolute right-2 top-2 flex space-x-2 z-10">
            <button
              onClick={toggleFullScreen}
              className="bg-[#3B82F6] text-white p-1 rounded text-xs hover:bg-[#2563EB] transition-colors"
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
              backgroundColor: '#1E293B'
            }}
            {...props}
          >
            {codeContent}
          </SyntaxHighlighter>
        </motion.div>
      </>
    );
  },
};

// Main MarkdownRenderer component
const MarkdownRenderer = ({ content }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ReactMarkdown
        className="prose prose-sm md:prose-base lg:prose-lg prose-slate max-w-none"
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={MarkdownComponents}
      >
        {content}
      </ReactMarkdown>
    </motion.div>
  );
};

export default MarkdownRenderer; 