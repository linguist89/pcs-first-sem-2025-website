'use client';

import React from 'react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import FullScreenCode from './FullScreenCode';
import Collapsible from './Collapsible';
import SectionHeader from './SectionHeader';

// Question Items List Component
const QuestionItemsList = ({ content }) => {
  // Parse the content to extract question, hint, answer, related items
  const parseItems = (text) => {
    const lines = text.split('\n');
    const items = [];
    let currentItem = null;
    let codeBlockLines = [];
    let inCodeBlock = false;
    
    lines.forEach(line => {
      // Check if we're entering or exiting a code block
      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        // If we have a current item, add the code block line to it
        if (currentItem) {
          codeBlockLines.push(line);
        }
        return;
      }
      
      // If we're in a code block, just collect the lines
      if (inCodeBlock) {
        if (currentItem) {
          codeBlockLines.push(line);
        }
        return;
      }
      
      // Check for list item with a special keyword
      const match = line.match(/^\s*-\s+\*\*(Question|Hint|Answer|Related):\*\*\s+(.*)/);
      if (match) {
        // If we found a new item, save the previous one if exists
        if (currentItem) {
          // Add any code blocks to the content
          if (codeBlockLines.length > 0) {
            currentItem.content += '\n' + codeBlockLines.join('\n');
            codeBlockLines = [];
          }
          items.push(currentItem);
        }
        // Start a new item
        currentItem = {
          type: match[1],
          content: match[2].trim()
        };
      } else if (currentItem && line.trim()) {
        // If we're in an item and have non-empty line, add to current content
        currentItem.content += '\n' + line.trim();
      }
    });
    
    // Add the last item if exists
    if (currentItem) {
      // Add any code blocks to the content
      if (codeBlockLines.length > 0) {
        currentItem.content += '\n' + codeBlockLines.join('\n');
      }
      items.push(currentItem);
    }
    
    return items;
  };
  
  const items = parseItems(content);
  
  if (items.length === 0) {
    // If no special items found, just render the content as is
    return (
      <div className="question-content-wrapper">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            ...MarkdownComponents,
            // Override pre element to always be a direct child of the wrapper
            pre: ({node, ...props}) => (
              <div className="pre-wrapper my-6">
                <pre {...props} />
              </div>
            ),
            // Override paragraph to prevent invalid nesting
            p: ({node, children, ...props}) => (
              <div className="my-4 text-[#4B5563]">{children}</div>
            )
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }
  
  // Custom component for rendering question item content safely
  const SafeContent = ({ content }) => {
    // Check if content contains code blocks
    const hasCodeBlock = content.includes('```');
    
    if (hasCodeBlock) {
      // For content with code blocks, use a div-based layout
      return (
        <div className="question-content-text">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              ...MarkdownComponents,
              // Override paragraph to prevent invalid nesting
              p: ({node, children, ...props}) => (
                <div className="my-4 text-[#4B5563]">{children}</div>
              ),
              // Override pre element to always be a direct child of the wrapper
              pre: ({node, ...props}) => (
                <div className="pre-wrapper my-6">
                  <pre {...props} />
                </div>
              )
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      );
    }
    
    // For simple text content without code blocks
    return (
      <div className="question-content-text">
        {content}
      </div>
    );
  };
  
  return (
    <div className="space-y-6 mt-2">
      {items.map((item, index) => (
        <QuestionItem 
          key={index} 
          type={item.type}
        >
          <SafeContent content={item.content} />
        </QuestionItem>
      ))}
    </div>
  );
};

// Section-specific icons
const sectionIcons = {
  'Scenario': (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  ),
  'Objective': (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  ),
  'Questions': (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  ),
  'Answer Code': (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  ),
  'Warm-up': (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
    </svg>
  )
};

// Get an icon for a section title
const getSectionIcon = (title) => {
  for (const [key, icon] of Object.entries(sectionIcons)) {
    if (title.toLowerCase().includes(key.toLowerCase())) {
      return icon;
    }
  }
  return null;
};

// Component for question/hint/answer/related items
const QuestionItem = ({ type, children }) => {
  let backgroundColor = 'bg-gray-100';
  let borderColor = 'border-gray-300';
  let icon = null;
  let iconBg = '';
  
  switch (type) {
    case 'Question':
      backgroundColor = 'bg-[#EFF6FF]';
      borderColor = 'border-[#3B82F6]';
      icon = '❓';
      iconBg = 'bg-[#DBEAFE]';
      break;
    case 'Hint':
      backgroundColor = 'bg-[#FFFBEB]';
      borderColor = 'border-[#FBBF24]';
      icon = '💡';
      iconBg = 'bg-[#FEF3C7]';
      break;
    case 'Answer':
      backgroundColor = 'bg-[#ECFDF5]';
      borderColor = 'border-[#10B981]';
      icon = '✅';
      iconBg = 'bg-[#D1FAE5]';
      break;
    case 'Related':
      backgroundColor = 'bg-[#F5F3FF]';
      borderColor = 'border-[#8B5CF6]';
      icon = '🔄';
      iconBg = 'bg-[#EDE9FE]';
      break;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`my-3 ${backgroundColor} border-l-4 ${borderColor} p-4 rounded-md shadow-sm`}
    >
      <div className="flex items-start">
        <span className={`mr-3 flex items-center justify-center w-8 h-8 rounded-full ${iconBg} text-lg`}>{icon}</span>
        <div className="flex-1">
          <strong className="font-bold text-[#1F2937]">{type}:</strong> {children}
        </div>
      </div>
    </motion.div>
  );
};

// Markdown components to handle different markdown elements
const MarkdownComponents = {
  // Custom wrapper component
  wrapper: ({ children }) => <>{children}</>,
  
  // Override h1 tag for main headers (like "Scenario")
  h1: ({node, children, ...props}) => {
    const title = React.Children.toArray(children).map(child => 
      typeof child === 'string' ? child : ''
    ).join('');
    
    return (
      <SectionHeader 
        title={title} 
        level={1}
        icon={getSectionIcon(title)}
        bgColor="bg-[#EFF6FF]"
        borderColor="border-[#3B82F6]"
      />
    );
  },
  
  // Override h2 tag to handle section headers (like "Objectives")
  h2: ({node, children, ...props}) => {
    const title = React.Children.toArray(children).map(child => 
      typeof child === 'string' ? child : ''
    ).join('');
    
    // Different background colors based on section type
    let bgColor = "bg-[#F3F4F6]";
    let borderColor = "border-[#3B82F6]";
    
    if (title.toLowerCase().includes('question')) {
      bgColor = "bg-[#EFF6FF]";
      borderColor = "border-[#3B82F6]";
    } else if (title.toLowerCase().includes('answer')) {
      bgColor = "bg-[#ECFDF5]";
      borderColor = "border-[#10B981]";
    } else if (title.toLowerCase().includes('objective')) {
      bgColor = "bg-[#FFFBEB]";
      borderColor = "border-[#FBBF24]";
    }
    
    return (
      <SectionHeader 
        title={title} 
        level={2}
        icon={getSectionIcon(title)}
        bgColor={bgColor}
        borderColor={borderColor}
      />
    );
  },
  
  // Override h3 tag for subsections as collapsible components
  h3: ({node, children, ...props}) => {
    // Get text content from children to use as title
    const title = React.Children.toArray(children).map(child => 
      typeof child === 'string' ? child : ''
    ).join('');
    
    // Get the section content - this will be supplied by the custom processor
    // For now we're just making the h3 itself collapsible
    return (
      <div className="mt-6 mb-4">
        <Collapsible title={
          <span className="text-lg font-bold text-[#1F2937]">{title}</span>
        } defaultOpen={false}>
          <div className="pt-2 pl-4 border-l-2 border-[#D1D5DB]">
            {/* Children will go here when we process sections */}
          </div>
        </Collapsible>
      </div>
    );
  },
  
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
  
  // Override p tag to prevent invalid nesting
  p: ({node, children, ...props}) => {
    // Check if children contains block elements that shouldn't be in paragraphs
    const hasBlockElement = React.Children.toArray(children).some(
      child => 
        React.isValidElement(child) && 
        (child.type === 'div' || child.type === 'pre' || 
         child.props?.node?.tagName === 'div' || 
         child.props?.node?.tagName === 'pre')
    );
    
    // If contains block elements, render as div instead of p
    if (hasBlockElement) {
      return <div {...props}>{children}</div>;
    }
    
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
  
  // Override lists with improved styling
  ul: ({node, className, ...props}) => {
    // Check if this list is inside a collapsible section
    const isInCollapsible = className && className.includes('collapsible-content');
    
    return (
      <ul 
        className={`list-disc pl-6 my-4 space-y-2 text-[#4B5563] ${
          isInCollapsible ? 'pl-4 space-y-4' : 'bg-[#F9FAFB] p-3 rounded-lg'
        }`} 
        {...props} 
      />
    );
  },
  
  ol: ({node, className, ...props}) => {
    // Check if this list is inside a collapsible section
    const isInCollapsible = className && className.includes('collapsible-content');
    
    return (
      <ol 
        className={`list-decimal pl-6 my-4 space-y-2 text-[#4B5563] ${
          isInCollapsible ? 'pl-4 space-y-4' : 'bg-[#F9FAFB] p-3 rounded-lg'
        }`}
        {...props} 
      />
    );
  },
  
  // Override list items to handle questions, hints, and answers with improved styling
  li: ({node, children, ...props}) => {
    const text = String(children);
    
    // Check if this is a question/hint/answer item with more precise regex
    const matches = text.match(/^\s*\*\*(Question|Hint|Answer|Related):\*\*\s+(.*)/);
    if (matches) {
      const type = matches[1];
      const content = matches[2].trim();
      
      return <QuestionItem type={type}>{content}</QuestionItem>;
    }
    
    return <li className="my-2 text-[#4B5563]" {...props}>{children}</li>;
  },
  
  // Override blockquote for important notes
  blockquote: ({node, ...props}) => (
    <motion.blockquote 
      initial={{ opacity: 0, borderLeftWidth: 0 }}
      animate={{ opacity: 1, borderLeftWidth: 4 }}
      transition={{ duration: 0.5 }}
      className="border-l-4 border-[#3B82F6] pl-4 italic my-6 text-[#4B5563] bg-[#F9FAFB] p-4 rounded-md shadow-sm"
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
    
    // Wrap in a div to prevent nesting issues
    return (
      <div className="my-6 code-block-wrapper">
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
          </div>
          <SyntaxHighlighter
            language={language}
            style={tomorrow}
            className="rounded-md !mt-0 !mb-0"
            customStyle={{
              padding: '1rem',
              borderRadius: '0.375rem',
              fontSize: '0.95rem',
              backgroundColor: '#1E293B'
            }}
            {...props}
          >
            {codeContent}
          </SyntaxHighlighter>
        </motion.div>
      </div>
    );
  },
  
  // Override pre element to never be inside paragraphs
  pre: ({node, children, ...props}) => {
    // Always wrap pre in a div to prevent nesting issues
    return (
      <div className="pre-container my-6">
        <pre {...props}>{children}</pre>
      </div>
    );
  },
};

// Function to detect if content has Question/Hint/Answer/Related items
const hasQuestionItems = (content) => {
  return /^\s*-\s+\*\*(Question|Hint|Answer|Related):\*\*/.test(content);
};

// Function to process markdown content to wrap sections under h3
const processSectionsWithCollapsible = (content) => {
  if (!content) return '';
  
  // Split content by h3 headers
  const h3Regex = /^### (.+)$/gm;
  const parts = content.split(h3Regex);
  
  if (parts.length <= 1) {
    return content; // No h3 headers found
  }
  
  // Reconstruct content with custom h3 tags for collapsible sections
  let processedContent = parts[0]; // Text before first h3
  
  for (let i = 1; i < parts.length; i += 2) {
    const title = parts[i];
    const sectionContent = parts[i + 1] || '';
    
    // Check if this section contains question items
    const hasQuestions = hasQuestionItems(sectionContent);
    
    processedContent += `<h3-collapsible title="${title}" has-questions="${hasQuestions}">
${sectionContent}
</h3-collapsible>`;
  }
  
  return processedContent;
};

// This function creates a simple custom rehype plugin to prevent invalid nesting
const createRehypeFixNesting = () => {
  return (tree) => {
    // Safely get tagName from a node
    const getTagName = (node) => {
      if (node && typeof node === 'object' && node.tagName) {
        return node.tagName;
      }
      return null;
    };
    
    // Walk through the tree and fix nesting issues
    const walk = (node) => {
      // Skip non-object nodes
      if (!node || typeof node !== 'object') {
        return;
      }
      
      // Get the tagName safely
      const tagName = getTagName(node);
      
      // If this is a paragraph node, check its children
      if (tagName === 'p') {
        // Check if it contains block elements
        const hasBlockElements = Array.isArray(node.children) && node.children.some(child => {
          const childTagName = getTagName(child);
          return childTagName && [
            'div', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
            'ul', 'ol', 'table', 'blockquote'
          ].includes(childTagName);
        });
        
        // If it has block elements, replace the paragraph with a div
        if (hasBlockElements) {
          node.tagName = 'div';
          node.properties = node.properties || {};
          node.properties.className = 'rehype-fix-p';
        }
      }
      
      // Process children recursively
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(walk);
      }
    };
    
    // Only process the tree if it's a valid object
    if (tree && typeof tree === 'object') {
      walk(tree);
    }
    
    return tree;
  };
};

// Custom component for rendering section content safely
const SafeSectionContent = ({ content, hasCode }) => {
  // Always use the special rendering approach for sections with code
  return (
    <div className="section-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          ...MarkdownComponents,
          // Use simplified code renderer for code blocks
          code: ({node, inline, className, children, ...props}) => {
            if (inline) {
              return <code className="font-mono bg-[#EEF2FF] text-[#3B82F6] px-2 py-0.5 rounded border border-[#DBEAFE] text-sm" {...props}>{children}</code>;
            }
            
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const codeContent = String(children).replace(/\n$/, '');
            
            return (
              <div className="my-6 code-block-wrapper">
                <SyntaxHighlighter
                  language={language}
                  style={tomorrow}
                  className="rounded-md"
                  customStyle={{
                    padding: '1rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.95rem',
                    backgroundColor: '#1E293B'
                  }}
                  {...props}
                >
                  {codeContent}
                </SyntaxHighlighter>
              </div>
            );
          },
          // Force paragraphs to be divs to prevent nesting issues
          p: ({node, children, ...props}) => (
            <div className="my-4 text-[#4B5563]">{children}</div>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

// Custom handling for our h3-collapsible tag
const H3CollapsibleComponent = ({ node, title, children, ...props }) => {
  // Get relevant icon for this section
  const icon = getSectionIcon(title);
  const hasQuestions = props['has-questions'] === 'true';
  const hasCode = props['has-code'] === 'true';
  
  // Get the content as string
  const contentStr = String(children).trim();
  
  // Determine if we should open by default - Advanced should always be open by default
  const isOpenByDefault = 
    title.toLowerCase().includes('beginner') || 
    title.toLowerCase() === 'advanced' || 
    title === 'Advanced';
  
  // Ensure we detect if this section has code blocks
  const detectCodeBlocks = /```\w*\n[\s\S]*?```/.test(contentStr);
  const shouldUseCodeRenderer = hasCode || detectCodeBlocks || title === 'Advanced';
  
  return (
    <div className="mt-6 mb-4">
      <Collapsible title={
        <div className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          <span className="text-lg font-bold text-[#1F2937]">{title}</span>
        </div>
      } defaultOpen={isOpenByDefault}>
        <div className="pt-2 pl-4 border-l-2 border-[#D1D5DB]">
          {hasQuestions ? (
            <QuestionItemsList content={contentStr} />
          ) : (
            <SafeSectionContent content={contentStr} hasCode={shouldUseCodeRenderer} />
          )}
        </div>
      </Collapsible>
    </div>
  );
};

const MarkdownRenderer = ({ content }) => {
  // More aggressive preprocessing to prevent invalid nesting
  const preprocessContent = (content) => {
    if (!content) return '';
    
    // First process collapsible sections
    let processedContent = processSectionsWithCollapsible(content);
    
    // Fix potential nesting issues with collapsibles
    // Pattern: Look for collapsibles that might be inside paragraphs and ensure they're not
    processedContent = processedContent.replace(
      /(<p>[\s\n]*)?(<h3-collapsible[\s\S]*?<\/h3-collapsible>)([\s\n]*<\/p>)?/g,
      (match, pOpen, collapsible, pClose) => {
        // Return just the collapsible without surrounding <p> tags
        return '\n\n' + collapsible + '\n\n';
      }
    );
    
    // Ensure double line breaks before and after collapsible to prevent them from being part of paragraphs
    processedContent = processedContent.replace(
      /([^\n])\n?(<h3-collapsible)/g, 
      '$1\n\n$2'
    );
    
    processedContent = processedContent.replace(
      /(<\/h3-collapsible>)\n?([^\n])/g, 
      '$1\n\n$2'
    );
    
    return processedContent;
  };
  
  // Process content with our custom preprocessor
  const processedContent = preprocessContent(content);
  
  // Create our custom rehype plugin
  const rehypeFixNesting = createRehypeFixNesting();
  
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeFixNesting]}
        components={{
          ...MarkdownComponents,
          // Custom handling for our h3-collapsible tag
          'h3-collapsible': H3CollapsibleComponent
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer; 