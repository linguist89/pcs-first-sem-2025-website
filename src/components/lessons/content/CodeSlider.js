'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';

const CodeSlider = ({
  slides = [],
  language = 'python',
  showLineNumbers = true,
  title,
  autoTransitionDelay = 0, // Set to 0 to disable auto transition
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [containerHeight, setContainerHeight] = useState('auto');
  const [showArrows, setShowArrows] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [explanationPosition, setExplanationPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const dragControls = useDragControls();
  
  const currentSlide = slides[currentSlideIndex];
  
  // Parse code blocks when the slide changes
  useEffect(() => {
    if (currentSlide && currentSlide.code) {
      const blocks = parseCodeBlocks(currentSlide.code, language);
      setCodeBlocks(blocks);
      setCurrentBlockIndex(0);
      
      // Reset explanation position when slide changes
      setExplanationPosition({ x: window.innerWidth * 0.3, y: window.innerHeight * 0.3 });
    }
  }, [currentSlideIndex, currentSlide, language]);
  
  // Parse code blocks based on comments
  const parseCodeBlocks = (code, lang) => {
    // Split the code by lines
    const lines = code.split('\n');
    const blocks = [];
    let currentBlock = { comment: '', code: [], startLine: 0, endLine: 0 };
    let blockStarted = false;
    
    // Determine comment character based on language
    const commentChar = lang === 'python' ? '#' : '//';
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      // Check if line starts with a comment
      if (trimmedLine.startsWith(commentChar)) {
        // If we already have a block, push it and start a new one
        if (blockStarted && currentBlock.code.length > 0) {
          currentBlock.endLine = index - 1;
          blocks.push(currentBlock);
          currentBlock = { comment: '', code: [], startLine: index, endLine: 0 };
        }
        // If this is the first block or a new block
        if (!blockStarted) {
          blockStarted = true;
          currentBlock.startLine = index;
        }
        // Extract comment text
        currentBlock.comment = trimmedLine.substring(commentChar.length).trim();
        // Add the comment line as part of the code block
        currentBlock.code.push(line);
      } else if (blockStarted) {
        // Add non-comment lines to the current block
        currentBlock.code.push(line);
      } else {
        // Handle code before the first comment
        if (blocks.length === 0) {
          currentBlock.code.push(line);
        }
      }
    });
    
    // Add the last block
    if (currentBlock.code.length > 0) {
      currentBlock.endLine = lines.length - 1;
      blocks.push(currentBlock);
    }
    
    // If no blocks were found, treat the entire code as one block
    if (blocks.length === 0 && lines.length > 0) {
      blocks.push({
        comment: 'Code',
        code: lines,
        startLine: 0,
        endLine: lines.length - 1
      });
    }
    
    return blocks;
  };
  
  // Navigate between code blocks within the same slide
  const nextBlock = () => {
    if (currentBlockIndex < codeBlocks.length - 1) {
      setCurrentBlockIndex(currentBlockIndex + 1);
    } else {
      // If this is the last block in the slide, attempt to move to the next slide
      if (currentSlideIndex < slides.length - 1) {
        handleNext();
      }
    }
  };
  
  const prevBlock = () => {
    if (currentBlockIndex > 0) {
      setCurrentBlockIndex(currentBlockIndex - 1);
    } else {
      // If this is the first block, attempt to move to the previous slide
      if (currentSlideIndex > 0) {
        handlePrev();
        // The useEffect will reset the current block to 0
      }
    }
  };
  
  // Find the maximum number of lines across all slides to determine container height
  useEffect(() => {
    if (slides.length > 0) {
      // Calculate the approximate height needed
      const maxLines = Math.max(...slides.map(slide => {
        const lineCount = (slide.code.match(/\n/g) || []).length + 1;
        return lineCount;
      }));
      
      // Set minimum height based on line count (approximate 24px per line plus some padding)
      const estimatedHeight = Math.max(200, maxLines * 24 + 80);
      setContainerHeight(`${estimatedHeight}px`);
    }
  }, [slides]);
  
  // Auto transition effect
  useEffect(() => {
    if (autoTransitionDelay > 0 && slides.length > 1) {
      const timer = setTimeout(() => {
        handleNext();
      }, autoTransitionDelay);
      
      return () => clearTimeout(timer);
    }
  }, [currentSlideIndex, autoTransitionDelay, slides.length]);
  
  const handleNext = () => {
    if (isAnimating || currentSlideIndex >= slides.length - 1) return;
    setIsAnimating(true);
    setCurrentSlideIndex(prev => prev + 1);
    setTimeout(() => setIsAnimating(false), 800);
  };
  
  const handlePrev = () => {
    if (isAnimating || currentSlideIndex <= 0) return;
    setIsAnimating(true);
    setCurrentSlideIndex(prev => prev - 1);
    setTimeout(() => setIsAnimating(false), 800);
  };
  
  const goToSlide = (index) => {
    if (isAnimating || index === currentSlideIndex) return;
    setIsAnimating(true);
    setCurrentSlideIndex(index);
    setTimeout(() => setIsAnimating(false), 800);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentSlide.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Fade animation variants with slight scale for smoother effect
  const fadeVariants = {
    initial: { 
      opacity: 0,
      scale: 0.98
    },
    animate: { 
      opacity: 1,
      scale: 1,
      transition: {
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 }
      }
    },
    exit: { 
      opacity: 0,
      scale: 1.02,
      transition: {
        opacity: { duration: 0.4 },
        scale: { duration: 0.3 }
      }
    }
  };
  
  // Animation variants for the focus point indicator
  const focusPointVariants = {
    initial: { 
      opacity: 0,
      scale: 0.8
    },
    animate: { 
      opacity: 1,
      scale: 1,
      transition: {
        opacity: { duration: 0.3, delay: 0.2 },
        scale: { duration: 0.3, delay: 0.2 }
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.8,
      transition: {
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 }
      }
    }
  };
  
  const renderCodeWithAnnotations = () => {
    return (
      <div className="relative h-full">
        {/* Code syntax highlighting with focused block */}
        <div className="h-full">
          <SyntaxHighlighter
            language={language}
            style={tomorrow}
            showLineNumbers={showLineNumbers}
            className="!mt-0 h-full"
            customStyle={{
              margin: 0,
              padding: '1rem',
              fontSize: '0.95rem',
              backgroundColor: '#1E293B',
              height: '100%',
              overflow: 'auto',
              position: 'relative'
            }}
            wrapLines={true}
            lineProps={lineNumber => {
              const style = {};
              // Check if the line is part of the current focused block
              const inFocusedBlock = lineNumber >= currentBlock.startLine && lineNumber <= currentBlock.endLine;
              
              if (inFocusedBlock) {
                style.backgroundColor = 'rgba(62, 207, 142, 0.1)';
                style.borderLeft = '3px solid #3ECF8E';
                style.paddingLeft = '1rem';
                style.filter = 'brightness(1.2)';
                style.opacity = 1;
              } else {
                // Blur and fade lines that are not in the current block
                style.filter = 'blur(1px) brightness(0.7)';
                style.opacity = 0.5;
                style.transition = 'filter 0.3s, opacity 0.3s';
              }
              
              return { style };
            }}
          >
            {currentSlide?.code || ''}
          </SyntaxHighlighter>
        </div>
        
        {/* Focus point indicator */}
        {currentSlide?.focusPoint && (
          <motion.div
            className="absolute"
            style={{
              top: `${currentSlide.focusPoint.y}%`,
              left: `${currentSlide.focusPoint.x}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 5
            }}
            variants={focusPointVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse shadow-lg shadow-blue-500/50" />
          </motion.div>
        )}

        {/* Toggle button to show explanation when hidden */}
        {!showExplanation && (
          <button
            onClick={() => setShowExplanation(true)}
            className="absolute bottom-4 right-4 z-20 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-colors"
            title="Show explanation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        )}
      </div>
    );
  };
  
  // Get the current block data for use in both renderCodeWithAnnotations and the floating explanation
  const currentBlock = codeBlocks[currentBlockIndex] || { comment: '', code: [], startLine: 0, endLine: 0 };
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        {title && (
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        )}
        
        <div className="relative border border-gray-200 rounded-lg overflow-hidden">
          {/* Code header with actions */}
          <div className="bg-gray-900 py-2 px-4 flex justify-between items-center">
            <div className="text-gray-400 text-sm font-mono flex items-center">
              <span className="mr-3">{language}</span>
              {codeBlocks.length > 0 && (
                <span className="text-xs bg-gray-800 px-2 py-0.5 rounded">
                  Block {currentBlockIndex + 1}/{codeBlocks.length}
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={copyToClipboard}
                className="text-gray-400 hover:text-white text-sm flex items-center px-2 py-1 rounded hover:bg-gray-800"
                title="Copy code"
              >
                {copied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Main content area with side navigation arrows */}
          <div 
            className="relative"
            onMouseEnter={() => setShowArrows(true)}
            onMouseLeave={() => setShowArrows(false)}
          >
            {/* Left arrow (Previous) */}
            <button
              onClick={handlePrev}
              disabled={currentSlideIndex === 0 || isAnimating}
              className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-30 p-2 rounded-r-md transition-all ${
                currentSlideIndex === 0 || isAnimating
                  ? 'opacity-0 cursor-default pointer-events-none' 
                  : showArrows 
                    ? 'opacity-90 hover:opacity-100 bg-gray-800 text-white hover:bg-gray-700 hover:shadow-md' 
                    : 'opacity-40 bg-gray-800 text-white'
              }`}
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Right arrow (Next) */}
            <button
              onClick={handleNext}
              disabled={currentSlideIndex === slides.length - 1 || isAnimating}
              className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-30 p-2 rounded-l-md transition-all ${
                currentSlideIndex === slides.length - 1 || isAnimating
                  ? 'opacity-0 cursor-default pointer-events-none' 
                  : showArrows 
                    ? 'opacity-90 hover:opacity-100 bg-gray-800 text-white hover:bg-gray-700 hover:shadow-md' 
                    : 'opacity-40 bg-gray-800 text-white'
              }`}
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Code content area with fixed height */}
            <div 
              ref={containerRef}
              className="relative bg-gray-900 overflow-hidden"
              style={{ height: containerHeight }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlideIndex}
                  variants={fadeVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute inset-0 w-full h-full flex flex-col"
                >
                  {renderCodeWithAnnotations()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          
          {/* Footer with progress indicators */}
          <div className="flex justify-center items-center p-3 bg-gray-100">
            {/* Progress indicators */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 mr-1">
                {currentSlideIndex + 1} / {slides.length}
              </div>
              
              <div className="flex space-x-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlideIndex 
                        ? 'bg-blue-600 transform scale-110' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                    title={`Slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Draggable floating explanation box - completely outside component hierarchy */}
      {showExplanation && codeBlocks.length > 0 && currentBlock && (
        <motion.div
          drag
          dragControls={dragControls}
          dragMomentum={false}
          dragElastic={0}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            x: explanationPosition.x,
            y: explanationPosition.y
          }}
          transition={{ delay: 0.1, duration: 0.3 }}
          onDragEnd={(e, info) => {
            setExplanationPosition({
              x: explanationPosition.x + info.offset.x,
              y: explanationPosition.y + info.offset.y
            });
          }}
          className="fixed bg-slate-800/95 p-4 rounded-lg shadow-2xl border border-slate-600 max-w-md pointer-events-auto cursor-move"
          style={{
            maxHeight: '80vh',
            overflow: 'auto',
            zIndex: 9999,
            top: 0,
            left: 0,
            transform: "none"
          }}
          onPointerDown={(e) => {
            dragControls.start(e);
          }}
        >
          <div 
            className="absolute top-0 left-0 w-full h-6 bg-slate-700 rounded-t-lg cursor-move flex items-center px-3"
            onPointerDown={(e) => {
              e.stopPropagation();
              dragControls.start(e);
            }}
          >
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-slate-500"></div>
              <div className="w-2 h-2 rounded-full bg-slate-500"></div>
              <div className="w-2 h-2 rounded-full bg-slate-500"></div>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-white">
              {currentBlock.comment || 'Code Block'}
            </h3>
            <div className="text-sm text-slate-400">
              Block {currentBlockIndex + 1} of {codeBlocks.length}
            </div>
          </div>
          
          <div className="max-w-none">
            {currentSlide.blockExplanations && currentSlide.blockExplanations[currentBlockIndex] ? (
              <ReactMarkdown components={{
                strong: ({node, ...props}) => (
                  <span className="font-bold text-yellow-300" {...props} />
                ),
                em: ({node, ...props}) => (
                  <span className="italic text-blue-300" {...props} />
                ),
                p: ({node, ...props}) => (
                  <p className="text-slate-100 text-lg leading-relaxed mb-2" {...props} />
                ),
                ul: ({node, ...props}) => (
                  <ul className="list-disc pl-5 text-slate-100 mb-2 space-y-1" {...props} />
                ),
                li: ({node, ...props}) => (
                  <li className="text-slate-100" {...props} />
                ),
                code: ({node, ...props}) => (
                  <code className="bg-slate-700 px-1 py-0.5 rounded text-amber-300 font-mono" {...props} />
                ),
              }}>
                {currentSlide.blockExplanations[currentBlockIndex]}
              </ReactMarkdown>
            ) : (
              <p className="text-slate-100">
                {currentSlide.explanation || `Examine this code block carefully.`}
              </p>
            )}
          </div>
          
          <div className="flex justify-between mt-4">
            <button 
              onClick={prevBlock}
              disabled={currentBlockIndex === 0 && currentSlideIndex === 0}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md font-medium flex items-center transition-colors shadow-md ${
                currentBlockIndex === 0 && currentSlideIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            
            <button 
              onClick={() => setShowExplanation(false)}
              className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1.5 rounded-md font-medium flex items-center transition-colors shadow-md mx-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Hide
            </button>
            
            <button 
              onClick={nextBlock}
              disabled={currentBlockIndex === codeBlocks.length - 1 && currentSlideIndex === slides.length - 1}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md font-medium flex items-center transition-colors shadow-md ${
                currentBlockIndex === codeBlocks.length - 1 && currentSlideIndex === slides.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default CodeSlider; 