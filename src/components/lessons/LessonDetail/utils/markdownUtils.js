// Extract content sections from markdown
export function extractSections(markdown) {
  const headingRegex = /^## (.+)$/gm;
  const sections = [];
  let match;
  
  while ((match = headingRegex.exec(markdown)) !== null) {
    // Skip quiz sections
    if (match[1].toLowerCase().includes('quiz') || 
        match[1].toLowerCase().includes('test your') || 
        match[1].toLowerCase().includes('assessment')) {
      continue;
    }
    
    sections.push({
      title: match[1],
      offset: match.index
    });
  }
  
  // Add indexes to each section
  return sections.map((section, index) => {
    const nextSectionOffset = index < sections.length - 1 ? sections[index + 1].offset : markdown.length;
    
    // Get the content without the heading line
    const contentWithHeading = markdown.substring(section.offset, nextSectionOffset);
    
    // Remove the first line (the heading) from the content
    const contentLines = contentWithHeading.split('\n');
    const contentWithoutHeading = contentLines.slice(1).join('\n').trim();
    
    return {
      ...section,
      content: contentWithoutHeading
    };
  });
}

// Remove quiz sections from markdown
export function removeQuizSections(markdown) {
  const quizHeadingRegex = /^## (.*(?:quiz|test your|assessment).*)$/gim;
  const sections = [];
  let match;
  let lastIndex = 0;
  
  // Find all quiz section headings
  while ((match = quizHeadingRegex.exec(markdown)) !== null) {
    // Add content before the quiz
    sections.push(markdown.substring(lastIndex, match.index));
    
    // Find the next heading to determine where the quiz section ends
    const nextHeadingRegex = /^## /gm;
    nextHeadingRegex.lastIndex = match.index + match[0].length;
    const nextMatch = nextHeadingRegex.exec(markdown);
    
    // Update lastIndex to the position after the quiz section
    lastIndex = nextMatch ? nextMatch.index : markdown.length;
  }
  
  // Add remaining content after the last quiz
  if (lastIndex < markdown.length) {
    sections.push(markdown.substring(lastIndex));
  }
  
  return sections.join('');
}

// Preprocess markdown content to fix inline code in lists
export function preprocessMarkdown(markdown) {
  // First remove all quiz sections
  const cleanedMarkdown = removeQuizSections(markdown);
  
  // Transform markdown to ensure inline code in list items renders properly
  // This regex matches list items with inline code and makes specific adjustments
  return cleanedMarkdown.replace(
    /^(\s*[-*+]|\s*\d+\.)\s+(.+?)(`[^`]+`)(.*)$/gm,
    (match, listMarker, beforeCode, codeBlock, afterCode) => {
      // Preserve the whole line but with optimized spacing
      return `${listMarker} ${beforeCode}${codeBlock}${afterCode}`;
    }
  );
} 