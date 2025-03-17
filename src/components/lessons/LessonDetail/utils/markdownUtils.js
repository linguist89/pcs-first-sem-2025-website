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
        title.includes('assessment')) {
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

// Process markdown to make h3 sections collapsible
export function processH3Sections(markdown) {
  if (!markdown) return '';
  
  // Split the content by h3 headers - using regex that ensures proper line breaks
  const h3Regex = /^### (.+)$/gm;
  let processedMarkdown = '';
  let lastIndex = 0;
  let match;
  
  // Find all h3 headers and convert them to collapsible blocks
  while ((match = h3Regex.exec(markdown)) !== null) {
    // Add content before this h3 header
    if (match.index > lastIndex) {
      processedMarkdown += markdown.substring(lastIndex, match.index);
    }
    
    // Get the section title
    const title = match[1];
    
    // Find where this section ends (at the next h1, h2, or h3)
    const nextHeaderRegex = /^#{1,3} /gm;
    nextHeaderRegex.lastIndex = match.index + match[0].length;
    const nextMatch = nextHeaderRegex.exec(markdown);
    const sectionEnd = nextMatch ? nextMatch.index : markdown.length;
    
    // Get the section content without the h3 heading itself
    const sectionContent = markdown.substring(match.index + match[0].length, sectionEnd).trim();
    
    // Check if this section contains question items and/or code blocks
    const hasQuestions = /^\s*-\s+\*\*(Question|Hint|Answer|Related):\*\*/.test(sectionContent);
    const hasCodeBlocks = sectionContent.includes('```');
    
    // Escape any internal quotes in the title to avoid breaking the tag
    const safeTitle = title.replace(/"/g, '&quot;');
    
    // Ensure the collapsible section is outside of any paragraphs and preserve code blocks
    // by adding double line breaks before and after
    processedMarkdown += `\n\n<h3-collapsible title="${safeTitle}" has-questions="${hasQuestions}" has-code="${hasCodeBlocks}">\n${sectionContent}\n</h3-collapsible>\n\n`;
    
    lastIndex = sectionEnd;
  }
  
  // Add any remaining content after the last match
  if (lastIndex < markdown.length) {
    processedMarkdown += markdown.substring(lastIndex);
  }
  
  return processedMarkdown;
}

// Helper function to ensure list items are properly formatted
function ensureProperListsInContent(content) {
  if (!content) return '';
  
  // First, find all the list items that start with **Keyword:**
  const listItemRegex = /-\s+\*\*(Question|Hint|Answer|Related):\*\*/g;
  
  // Get all matches and their positions
  const matches = [];
  let match;
  while ((match = listItemRegex.exec(content)) !== null) {
    matches.push({
      type: match[1],
      position: match.index
    });
  }
  
  // If no special list items found, return content as is
  if (matches.length === 0) {
    return content;
  }
  
  // Process the content by splitting at each match position and recombining with proper formatting
  let result = '';
  let lastPos = 0;
  
  matches.forEach((matchItem, index) => {
    // Find the end of this list item (either the next list item or end of content)
    const nextPos = index < matches.length - 1 ? matches[index + 1].position : content.length;
    
    // Extract this list item's text
    const itemText = content.substring(matchItem.position, nextPos).trim();
    
    // Add content before this match if it's the first match
    if (index === 0 && matchItem.position > 0) {
      result += content.substring(0, matchItem.position);
    }
    
    // Add the list item with proper formatting
    result += itemText + '\n\n';
    
    lastPos = nextPos;
  });
  
  // Add any remaining content after the last match
  if (lastPos < content.length) {
    result += content.substring(lastPos);
  }
  
  // Add blank lines between items to ensure proper separation
  return result.replace(/(-\s+\*\*(Question|Hint|Answer|Related):\*\*.*?)(?=\n\s*-\s+\*\*|\n\s*$)/gs, '$1\n');
}

// Preprocess markdown content
export function preprocessMarkdown(markdown) {
  // First remove all quiz sections
  let processedMarkdown = removeQuizSections(markdown);
  
  // Process collapsible sections
  processedMarkdown = processH3Sections(processedMarkdown);
  
  // Transform markdown to ensure inline code in list items renders properly
  processedMarkdown = processedMarkdown.replace(
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