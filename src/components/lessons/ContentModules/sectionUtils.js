/**
 * Determines the section type based on the content and context
 * 
 * @param {Object} section - The section data
 * @param {number} index - The index of the section in the content array
 * @param {Array} allContent - The complete content array for context
 * @returns {string} The determined section type
 */
export const determineSectionType = (section, index, allContent) => {
  const { type, title, caption, language, content: contentText } = section;
  
  // First, check for warmup sections
  if (isWarmupSection(section, index, allContent)) {
    return 'warmup';
  }
  
  // Exercise section detection
  if (
    type === 'exercise' ||
    type === 'challenge' ||
    title?.toLowerCase().includes('exercise') ||
    title?.toLowerCase().includes('task') ||
    title?.toLowerCase().includes('challenge')
  ) {
    return 'exercise';
  }
  
  // Post-lesson section detection
  if (
    type === 'quiz' ||
    title?.toLowerCase().includes('quiz') ||
    title?.toLowerCase().includes('summary') ||
    title?.toLowerCase().includes('conclusion') ||
    title?.toLowerCase().includes('further reading') ||
    title?.toLowerCase().includes('homework')
  ) {
    return 'postlesson';
  }
  
  // Default to lesson section
  return 'lesson';
};

/**
 * Checks if a section is a warmup section
 * 
 * @param {Object} section - The section data
 * @param {number} index - The index of the section in the content array
 * @param {Array} allContent - The complete content array for context
 * @returns {boolean} True if the section is a warmup section
 */
export const isWarmupSection = (section, index, allContent) => {
  const { type, title, caption, language, content: contentText } = section;
  
  // Check for explicit warmup blocks
  if (
    title?.toLowerCase().includes('warm') || 
    title?.toLowerCase().includes('warmup') ||
    title?.toLowerCase().includes('warm-up') ||
    title?.toLowerCase().includes('prerequisites') ||
    caption?.toLowerCase().includes('warm') ||
    (type === 'code' && language === 'bash' && 
      (contentText?.includes('wget') || 
       contentText?.includes('curl') || 
       contentText?.includes('download')))
  ) {
    return true;
  }
  
  // Check for sequential warmup code blocks
  if (isWarmupSequence(section, index, allContent)) {
    return true;
  }
  
  // Check for code block that follows a warmup title
  const prevItem = index > 0 ? allContent[index - 1] : null;
  if (prevItem && 
      type === 'code' && 
      prevItem.type === 'text' &&
      prevItem.title && 
      (prevItem.title.toLowerCase().includes('warm') || 
       prevItem.title.toLowerCase().includes('prerequisites'))) {
    return true;
  }
  
  return false;
};

/**
 * Checks if a section is part of a warmup sequence
 * 
 * @param {Object} section - The section data
 * @param {number} index - The index of the section in the content array
 * @param {Array} allContent - The complete content array for context
 * @returns {boolean} True if the section is part of a warmup sequence
 */
export const isWarmupSequence = (section, index, allContent) => {
  const { type, title } = section;
  
  // Check for previous warmup sections
  let foundWarmupHeader = false;
  let sequentialCodeBlocks = true;
  
  // Look backwards to find a warmup header
  for (let i = index - 1; i >= 0; i--) {
    const prevItem = allContent[i];
    
    // If we find a warmup header, mark it
    if (prevItem.type === 'text' && 
        prevItem.title && (
          prevItem.title.toLowerCase().includes('warm') || 
          prevItem.title.toLowerCase().includes('warmup') || 
          prevItem.title.toLowerCase().includes('warm-up') ||
          prevItem.title.toLowerCase().includes('prerequisites')
        )) {
      foundWarmupHeader = true;
      break;
    }
    
    // If we encounter a non-code block or a different section header before finding a warmup header,
    // this breaks the sequential code blocks pattern
    if (prevItem.type !== 'code') {
      if (prevItem.type === 'text' && prevItem.title) {
        // We hit a different section header
        break;
      }
      // If it's not a code block or a section header, continue checking
      if (prevItem.type !== 'text' || !(prevItem.content && !prevItem.title)) {
        sequentialCodeBlocks = false;
        break;
      }
    }
  }
  
  // If there's a warmup header and we're in a sequence of code blocks
  if (foundWarmupHeader && (type === 'code' || (type === 'text' && !title))) {
    return true;
  }
  
  return false;
};

/**
 * Groups lesson content sections by type
 * 
 * @param {Array} content - The complete lesson content array
 * @returns {Object} Object with section types as keys and arrays of content as values
 */
export const groupContentBySection = (content) => {
  return content.reduce((acc, section, index) => {
    const sectionType = determineSectionType(section, index, content);
    if (!acc[sectionType]) {
      acc[sectionType] = [];
    }
    acc[sectionType].push({...section, index});
    return acc;
  }, {});
};

/**
 * Configuration for section titles and icons
 */
export const sectionConfig = {
  warmup: { 
    title: "Warm-up", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
      </svg>
    ) 
  },
  lesson: { 
    title: "Lesson Content", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ) 
  },
  exercise: { 
    title: "Exercises", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ) 
  },
  postlesson: { 
    title: "Post-Lesson", 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ) 
  }
};

// Default order for rendering sections
export const sectionOrder = ['warmup', 'lesson', 'exercise', 'postlesson']; 