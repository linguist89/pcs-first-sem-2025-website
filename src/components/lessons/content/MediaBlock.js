'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const MediaBlock = ({ src, alt, caption, type = 'image', width = 800, height = 450 }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <div 
        className={`relative rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90' : ''}`}
        style={{ maxWidth: isFullscreen ? 'none' : '100%' }}
      >
        {type === 'image' && (
          <div className="relative" style={{ aspectRatio: width / height }}>
            <Image
              src={src}
              alt={alt || 'Lesson image'}
              fill
              className={`object-contain cursor-pointer ${isFullscreen ? 'max-h-screen max-w-screen' : ''}`}
              onClick={toggleFullscreen}
              sizes={isFullscreen ? '100vw' : '(max-width: 768px) 100vw, 800px'}
            />
          </div>
        )}
        
        {type === 'video' && (
          <div className={`relative ${isFullscreen ? 'w-full h-full' : ''}`}>
            <video
              src={src}
              controls
              className={`w-full rounded-lg ${isFullscreen ? 'max-h-screen max-w-screen' : ''}`}
              onClick={e => {
                // Prevent fullscreen toggle when clicking player controls
                if (e.target === e.currentTarget) toggleFullscreen();
              }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}
        
        {isFullscreen && (
          <button 
            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
            onClick={toggleFullscreen}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {caption && (
        <div className="text-sm text-[var(--text-secondary)] italic mt-2 px-1">
          {caption}
        </div>
      )}
    </motion.div>
  );
};

export default MediaBlock; 