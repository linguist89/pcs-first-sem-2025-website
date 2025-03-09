'use client';

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
  
  // Override h2 tag to handle section headers
  h2: ({node, ...props}) => (
    <h2 className="text-xl font-bold text-text-primary mb-4 mt-8" {...props} />
  ),
  
  // Override h3 tag
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
  
  // Force paragraphs in list items to be inline
  p: ({node, children, ...props}) => {
    // Check if parent is a list item
    const isInListItem = 
      node.position?.parent?.type === 'listItem' || 
      node.parentNode?.tagName === 'li';
    
    if (isInListItem) {
      return <>{children}</>;
    }
    
    return <p className="mb-4 text-text-secondary" {...props}>{children}</p>;
  },
  
  // Override lists with proper styling
  ul: ({node, ...props}) => (
    <ul className="list-disc pl-6 mb-4 text-text-secondary" {...props} />
  ),
  
  ol: ({node, ...props}) => (
    <ol className="list-decimal pl-6 mb-4 text-text-secondary" {...props} />
  ),
  
  // Override code blocks with better detection of inline vs block code
  code: ({node, inline, className, children, ...props}) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const [isFullScreen, setIsFullScreen] = useState(false);
    
    // More precise detection for inline code
    // Only treat code as inline when:
    // 1. It's explicitly marked as inline by react-markdown
    // 2. OR it's a short string with no language specified
    const content = String(children || '');
    const hasLanguageClass = className && className.includes('language-');
    const isInlineCode = inline || 
                         (!hasLanguageClass && 
                          content.length < 50 && 
                          !content.includes('\n'));

    // Check if content appears to be HTML/XML tags that need special handling
    const containsHTMLTags = content.match(/^<[a-zA-Z][^>]*>$/);
    
    if (isInlineCode) {
      // Common inline code styles with better contrast
      const inlineCodeStyles = {
        display: 'inline',
        fontFamily: 'monospace',
        backgroundColor: 'var(--bg-accent, rgba(0, 100, 200, 0.1))',
        color: 'var(--text-primary, inherit)',
        padding: '0.1rem 0.3rem',
        borderRadius: '0.25rem',
        fontSize: '0.875rem',
        verticalAlign: 'baseline',
        whiteSpace: 'normal',
        border: '1px solid var(--border-light, rgba(0, 100, 200, 0.2))'
      };
      
      // For HTML tags in inline code, we need to ensure they display as text
      if (containsHTMLTags) {
        const escapedContent = content
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        
        return (
          <code 
            className="inline-code"
            style={inlineCodeStyles}
            dangerouslySetInnerHTML={{ __html: escapedContent }}
          />
        );
      }
      
      // Standard inline code
      return (
        <code 
          className="inline-code"
          style={inlineCodeStyles}
          {...props}
        >
          {children}
        </code>
      );
    }
    
    // For actual code blocks (with language or multiple lines), use syntax highlighter
    return (
      <div className="mb-6 relative overflow-hidden">
        <div className="rounded-lg overflow-hidden">
          <SyntaxHighlighter
            language={language}
            style={tomorrow}
            showLineNumbers={true}
            wrapLongLines={true}
            customStyle={{
              margin: 0, 
              borderRadius: '0.5rem',
              overflowX: 'auto',
              padding: '1rem',
              maxWidth: '100%'
            }}
            {...props}
          >
            {content}
          </SyntaxHighlighter>
          
          <div className="absolute top-2 right-2 flex space-x-2">
            {/* Fullscreen button */}
            <button 
              onClick={() => setIsFullScreen(true)}
              className="bg-bg-primary p-1.5 rounded-md text-text-secondary hover:text-primary transition-colors"
              aria-label="View code in fullscreen"
              title="View code in fullscreen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            </button>
            
            {/* Copy code button */}
            <button 
              onClick={() => {
                navigator.clipboard.writeText(content);
                // You could add a toast notification here
              }}
              className="bg-bg-primary p-1.5 rounded-md text-text-secondary hover:text-primary transition-colors"
              aria-label="Copy code to clipboard"
              title="Copy code to clipboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Fullscreen overlay */}
        <FullScreenCode 
          isOpen={isFullScreen} 
          onClose={() => setIsFullScreen(false)}
          code={content}
          language={language}
          title={language.charAt(0).toUpperCase() + language.slice(1) || 'Code'}
        />
      </div>
    );
  },
};

// Component to render markdown with styling
const MarkdownRenderer = ({ content }) => {
  return (
    <div className="custom-markdown overflow-hidden">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeRaw]}
        components={MarkdownComponents}
        unwrapDisallowed={true}
        skipHtml={false}
        className="overflow-x-auto"
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer; 