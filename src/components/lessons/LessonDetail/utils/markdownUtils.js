// Extract content sections from markdown
export function extractSections(markdown) {
  // Match H1, H2, and H3 headings
  const headingRegex = /^(#+) (.+)$/gm;
  const sections = [];
  let match;
  
  while ((match = headingRegex.exec(markdown)) !== null) {
    const levelMarkers = match[1]; // Get the # symbols
    const level = levelMarkers.length; // Count the # to determine heading level (1, 2, or 3)
    const title = match[2].trim();
    
    // Skip quiz sections or specific sections you want to exclude
    if (title.toLowerCase().includes('quiz') || 
        title.toLowerCase().includes('test your') || 
        title.toLowerCase().includes('assessment')) {
      continue;
    }
    
    // Create a slug/id from the title for anchor links
    const id = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-'); // Replace spaces with hyphens
    
    sections.push({
      title,
      level,
      id,
      offset: match.index
    });
  }
  
  // Add content to each section
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

// Preprocess markdown content
export function preprocessMarkdown(markdown) {
  // First remove all quiz sections
  const cleanedMarkdown = removeQuizSections(markdown);
  
  // Process special highlighted text [n text] - keep as is for the React component to handle
  
  // Transform markdown to ensure inline code in list items renders properly
  let processedMarkdown = cleanedMarkdown.replace(
    /^(\s*[-*+]|\s*\d+\.)\s+(.+?)(`[^`]+`)(.*)$/gm,
    (match, listMarker, beforeCode, codeBlock, afterCode) => {
      // Preserve the whole line but with optimized spacing
      return `${listMarker} ${beforeCode}${codeBlock}${afterCode}`;
    }
  );
  
  // Convert Scenario highlighted to regular Scenario with highlights
  if (processedMarkdown.includes('# Scenario highlighted')) {
    processedMarkdown = processedMarkdown.replace('# Scenario highlighted', '# Scenario');
  }
  
  return processedMarkdown;
} 