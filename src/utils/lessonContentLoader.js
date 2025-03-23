'use server';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * Load markdown content from a file
 * 
 * @param {string} filePath - Path to the markdown file
 * @returns {Object} - Object with frontmatter and content
 */
export async function loadMarkdownContent(filePath) {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return {
        error: true,
        message: `File not found: ${filePath}`
      };
    }

    // Read file content
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    // Parse frontmatter and content
    const { data, content } = matter(fileContents);
    
    return {
      frontmatter: data,
      content: content.trim()
    };
  } catch (error) {
    console.error(`Error loading markdown content from ${filePath}:`, error);
    return {
      error: true,
      message: `Error loading content: ${error.message}`
    };
  }
}

/**
 * Load content for each section referenced in a lesson
 * 
 * @param {Array} contentSections - Array of content sections from lesson JSON
 * @param {string} lessonPath - Path to the lesson directory
 * @returns {Array} - Array of content sections with loaded content
 */
export async function loadLessonContent(contentSections, lessonPath) {
  if (!contentSections || !Array.isArray(contentSections)) {
    console.error('Invalid content sections:', contentSections);
    return [];
  }

  const loadedSections = [];
  
  for (const section of contentSections) {
    // If the section has direct content, return it as is
    if (!section.contentPath) {
      loadedSections.push(section);
      continue;
    }

    // Build the path to the content file
    const contentFilePath = path.join(lessonPath, section.contentPath);
    
    // Load the content
    const loadedContent = await loadMarkdownContent(contentFilePath);
    
    if (loadedContent.error) {
      loadedSections.push({
        ...section,
        content: `Failed to load content: ${loadedContent.message}`
      });
    } else {
      // Merge the loaded content with section data
      loadedSections.push({
        ...section,
        content: loadedContent.content,
        ...(loadedContent.frontmatter && { props: { ...section.props, ...loadedContent.frontmatter } })
      });
    }
  }
  
  return loadedSections;
}

/**
 * Create a markdown file template based on section type
 * 
 * @param {string} type - Type of section (text, code, exercise, etc.)
 * @param {Object} props - Properties for the section
 * @returns {string} - Markdown template content
 */
export async function createSectionTemplate(type, props = {}) {
  // Base frontmatter with type
  const frontmatter = {
    type,
    ...props
  };
  
  // Frontmatter as YAML
  const yamlFrontmatter = Object.entries(frontmatter)
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return `${key}: "${value}"`;
      }
      return `${key}: ${value}`;
    })
    .join('\n');
  
  // Template content based on section type
  let templateContent = '';
  
  switch (type) {
    case 'text':
      templateContent = 'Add your text content here. You can use **markdown** formatting.';
      break;
    case 'code':
      templateContent = '```python\n# Add your code here\nprint("Hello, world!")\n```';
      break;
    case 'interactive_code':
      templateContent = '```python\n# Add your interactive code here\ndef my_function():\n    return "Hello, world!"\n```';
      break;
    case 'exercise':
      templateContent = `## Exercise: ${props.title || 'Title'}\n\nDescribe the exercise here.\n\n### Hints\n\n- Hint 1\n- Hint 2`;
      break;
    case 'quiz':
      templateContent = `## Quiz: ${props.title || 'Title'}\n\n1. Question 1?\n   - Option A\n   - Option B\n   - Option C\n   - Option D`;
      break;
    default:
      templateContent = 'Add your content here.';
  }
  
  // Return markdown with frontmatter
  return `---\n${yamlFrontmatter}\n---\n\n${templateContent}`;
}

/**
 * Create a modular lesson structure with separate markdown files for each section
 * 
 * @param {string} lessonsDir - Directory where lessons are stored
 * @param {Object} lessonData - Lesson data from JSON
 * @returns {Object} - Result with lessonDir and sectionCount
 */
export async function createModularLessonStructure(lessonsDir, lessonData) {
  console.log('Creating modular lesson structure...');
  
  try {
    // Validate lesson data
    if (!lessonData || !lessonData.id || !lessonData.content) {
      throw new Error('Invalid lesson data. Missing id or content.');
    }
    
    const lessonId = lessonData.id;
    const lessonDirName = lessonData.slug || `${lessonId}-${lessonData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    const lessonDir = path.join(lessonsDir, lessonDirName);
    
    console.log(`Creating lesson directory: ${lessonDir}`);
    
    // Create lesson directory if it doesn't exist
    if (!fs.existsSync(lessonDir)) {
      fs.mkdirSync(lessonDir, { recursive: true });
    }
    
    // Create a directory for content sections
    const sectionsDir = path.join(lessonDir, 'sections');
    if (!fs.existsSync(sectionsDir)) {
      fs.mkdirSync(sectionsDir, { recursive: true });
    }
    
    // Track created sections
    const createdSections = [];
    
    // Process each content section
    if (Array.isArray(lessonData.content)) {
      console.log(`Processing ${lessonData.content.length} content sections...`);
      
      // Create a markdown file for each section
      for (let i = 0; i < lessonData.content.length; i++) {
        const section = lessonData.content[i];
        const sectionNumber = String(i + 1).padStart(2, '0');
        const sectionType = section.type || 'text';
        const sectionFileName = `${sectionNumber}-${sectionType}.md`;
        const sectionPath = path.join(sectionsDir, sectionFileName);
        
        console.log(`Creating section file: ${sectionPath}`);
        
        // Create markdown content for the section
        const templateContent = await createSectionTemplate(
          sectionType,
          section.props || {}
        );
        
        // Add the actual content if it exists
        let sectionContent = templateContent;
        if (section.content) {
          sectionContent = `---\ntype: "${sectionType}"\n${
            section.props ? Object.entries(section.props)
              .map(([key, value]) => {
                if (typeof value === 'string') {
                  return `${key}: "${value}"`;
                }
                return `${key}: ${value}`;
              })
              .join('\n') : ''
          }\n---\n\n${section.content}`;
        }
        
        // Write the section file
        fs.writeFileSync(sectionPath, sectionContent);
        
        // Add section to the list of created sections
        createdSections.push({
          ...section,
          contentPath: `sections/${sectionFileName}`
        });
      }
    }
    
    // Create the lesson index JSON file
    const lessonIndex = {
      ...lessonData,
      format: 'modular',
      content: createdSections.map(section => ({
        type: section.type,
        contentPath: section.contentPath,
        props: section.props || {}
      }))
    };
    
    const indexPath = path.join(lessonDir, 'index.json');
    console.log(`Creating lesson index file: ${indexPath}`);
    fs.writeFileSync(indexPath, JSON.stringify(lessonIndex, null, 2));
    
    console.log(`Modular lesson created successfully in ${lessonDirName}`);
    
    // Return result with the relative path for client use
    return {
      lessonDir: `modules/${lessonDirName}`,
      sectionCount: createdSections.length
    };
  } catch (error) {
    console.error('Error creating modular lesson structure:', error);
    throw error;
  }
} 