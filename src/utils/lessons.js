'use server';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { loadLessonContent } from './lessonContentLoader';

// Sample lesson content to create if none exists - making this a non-exported constant
const sampleLessonContent = `---
title: Introduction to Functions in Python
description: Learn the basics of defining and using functions in Python
difficulty: Beginner
duration: 20 minutes
---

# Introduction to Functions

Functions are reusable blocks of code that perform a specific task.

## Defining a Function

In Python, you define a function using the \`def\` keyword:

\`\`\`python
def greet(name):
    return f"Hello, {name}!"
\`\`\`

## Calling a Function

Once defined, you can call a function by using its name followed by parentheses:

\`\`\`python
message = greet("Alice")
print(message)  # Outputs: Hello, Alice!
\`\`\`
`;

// Ensure the lessons directory exists and has at least one lesson
export async function ensureLessonsDirectory() {
  const lessonsDirectory = path.join(process.cwd(), 'public', 'data', 'Lessons');
  
  // Create directories if they don't exist
  if (!fs.existsSync(path.join(process.cwd(), 'public'))) {
    fs.mkdirSync(path.join(process.cwd(), 'public'));
  }
  
  if (!fs.existsSync(path.join(process.cwd(), 'public', 'data'))) {
    fs.mkdirSync(path.join(process.cwd(), 'public', 'data'));
  }
  
  if (!fs.existsSync(lessonsDirectory)) {
    fs.mkdirSync(lessonsDirectory);
  }
  
  // Check if the directory is empty
  const files = fs.readdirSync(lessonsDirectory);
  if (files.length === 0) {
    // Create a sample lesson
    fs.writeFileSync(
      path.join(lessonsDirectory, '01-introduction-to-functions.md'),
      sampleLessonContent
    );
  }
  
  return lessonsDirectory;
}

// Get all available lesson files
export async function getAllLessonFiles() {
  const lessonsDirectory = path.join(process.cwd(), 'public', 'data', 'Lessons');
  const jsonDirectory = path.join(lessonsDirectory, 'json');
  const modulesDirectory = path.join(lessonsDirectory, 'modules');
  
  // Get JSON lessons
  const jsonLessons = fs.existsSync(jsonDirectory)
    ? fs.readdirSync(jsonDirectory)
      .filter(file => file.endsWith('.json'))
      .map(file => ({ file: `json/${file}`, format: 'json' }))
    : [];
    
  // Get modular lessons (lessons with index.json files)
  const modularLessons = fs.existsSync(modulesDirectory)
    ? fs.readdirSync(modulesDirectory)
      .filter(dir => {
        const indexPath = path.join(modulesDirectory, dir, 'index.json');
        return fs.existsSync(indexPath) && fs.statSync(path.join(modulesDirectory, dir)).isDirectory();
      })
      .map(dir => ({ file: `modules/${dir}/index.json`, format: 'modular' }))
    : [];
  
  return [...jsonLessons, ...modularLessons];
}

// Parse lesson file to get metadata
export async function parseLessonFile(file, lessonsDirectory, includeContent = false) {
  const fullPath = path.join(lessonsDirectory, file);
  
  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    console.error(`File does not exist: ${fullPath}`);
    return null;
  }
  
  // Determine the format based on the file path
  const isJsonLesson = file.includes('json/') || file.endsWith('.json') && !file.includes('modules/');
  const isModularLesson = file.includes('modules/') && file.endsWith('index.json');
  
  try {
    if (isJsonLesson) {
      return await parseJsonLesson(fullPath, includeContent);
    } else if (isModularLesson) {
      return await parseModularLesson(fullPath, lessonsDirectory, includeContent);
    } else {
      return await parseMarkdownLesson(fullPath, file, includeContent);
    }
  } catch (err) {
    console.error(`Error parsing lesson file ${file}:`, err);
    return null;
  }
}

// Parse modular lesson with markdown content files
async function parseModularLesson(filePath, lessonsDirectory, includeContent = false) {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const jsonData = JSON.parse(fileContents);
  
  // Get lesson ID and metadata
  const lessonDir = path.dirname(filePath);
  const dirName = path.basename(path.dirname(filePath));
  
  const lessonNumber = jsonData.id || dirName.split('-')[0];
  
  // Extract description if not provided
  let description = jsonData.description;
  if (!description) {
    // Try to find a text section to use as description
    const textSection = jsonData.content?.find(section => section.type === 'text');
    if (textSection && textSection.content) {
      description = textSection.content.substring(0, 150) + '...';
    } else if (textSection && textSection.contentPath) {
      // Try to load content from file
      const contentPath = path.join(lessonDir, textSection.contentPath);
      if (fs.existsSync(contentPath)) {
        const { content } = matter(fs.readFileSync(contentPath, 'utf8'));
        description = content.substring(0, 150) + '...';
      } else {
        description = `Lesson ${lessonNumber}`;
      }
    } else {
      description = `Lesson ${lessonNumber}`;
    }
  }
  
  const lessonData = {
    id: lessonNumber,
    slug: dirName,
    title: jsonData.title || 'Untitled Lesson',
    description,
    difficulty: jsonData.difficulty || 'Intermediate',
    duration: jsonData.duration || '30 minutes',
    topics: jsonData.topics || [],
    format: 'modular'
  };
  
  if (includeContent && jsonData.content) {
    // Load content from referenced markdown files
    const loadedContent = await loadLessonContent(jsonData.content, lessonDir);
    return { lesson: lessonData, content: loadedContent };
  }
  
  return lessonData;
}

// Parse JSON lesson file
async function parseJsonLesson(filePath, includeContent = false) {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const jsonData = JSON.parse(fileContents);
  
  // Get the file name for ID extraction
  const fileName = path.basename(filePath);
  const lessonNumber = jsonData.id || fileName.split('-')[0].replace('.json', '');
  
  // Extract a short excerpt if description is not provided
  let description = jsonData.description;
  if (!description) {
    // Try to find a text section to use as description
    const textSection = jsonData.content?.find(section => section.type === 'text');
    if (textSection) {
      description = textSection.content.substring(0, 150) + '...';
    } else {
      description = `Lesson ${lessonNumber}`;
    }
  }
  
  const lessonData = {
    id: lessonNumber,
    slug: fileName.replace('.json', ''),
    title: jsonData.title || 'Untitled Lesson',
    description,
    difficulty: jsonData.difficulty || 'Intermediate',
    duration: jsonData.duration || '30 minutes',
    topics: jsonData.topics || [],
    format: 'json'
  };
  
  return includeContent ? { lesson: lessonData, content: jsonData.content } : lessonData;
}

// Parse markdown lesson file
async function parseMarkdownLesson(filePath, fileName, includeContent = false) {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data: frontmatter, content } = matter(fileContents);
  
  // Get the lesson number from the filename
  const parsedName = path.parse(fileName).name;
  const lessonNumber = parsedName.split('-')[0];
  
  // Extract a short excerpt from the content for preview
  const excerpt = fileContents
    .replace(/---[\s\S]*?---/, '') // Remove frontmatter
    .replace(/#+\s.*\n/g, '')      // Remove headings
    .replace(/\[.*?\]/g, '')       // Remove markdown links
    .replace(/\n/g, ' ')           // Replace newlines with spaces
    .trim()
    .substring(0, 150) + '...';    // Limit to 150 chars
  
  const lessonData = {
    id: lessonNumber,
    slug: parsedName,
    title: frontmatter.title || 'Untitled Lesson',
    description: frontmatter.description || excerpt,
    difficulty: frontmatter.difficulty || 'Intermediate',
    duration: frontmatter.duration || '30 minutes',
    topics: frontmatter.topics || [],
    format: 'markdown',
    ...frontmatter
  };
  
  return includeContent ? { lesson: lessonData, content } : lessonData;
}

// Convert markdown lesson to JSON format
export async function convertMarkdownToJson(markdownContent, frontmatter) {
  // Basic implementation - in a real system you would want more robust parsing
  const sections = [];
  
  // Extract sections from markdown
  const lines = markdownContent.split('\n');
  let currentSection = null;
  let currentContent = [];
  
  lines.forEach((line, index) => {
    // Check for headings
    if (line.startsWith('#')) {
      // Save previous section if exists
      if (currentSection) {
        sections.push({
          type: 'text',
          title: currentSection,
          content: currentContent.join('\n')
        });
      }
      
      // Start new section
      currentSection = line.replace(/^#+\s+/, '');
      currentContent = [];
    } 
    // Check for code blocks
    else if (line.startsWith('```')) {
      // If this is the start of a code block
      if (!currentContent.includes('```')) {
        // Get the language if specified
        const language = line.replace('```', '').trim();
        
        // Collect all lines until the closing ```
        const codeLines = [];
        let i = index + 1;
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        
        // Add code block to sections
        sections.push({
          type: 'code',
          language: language || 'plaintext',
          content: codeLines.join('\n')
        });
        
        // Skip ahead to after closing ```
        index = i;
      }
    }
    // Add to current content
    else {
      currentContent.push(line);
    }
  });
  
  // Add the last section if exists
  if (currentSection) {
    sections.push({
      type: 'text',
      title: currentSection,
      content: currentContent.join('\n')
    });
  }
  
  // Create the final JSON structure
  const jsonLesson = {
    id: frontmatter.id || '00',
    title: frontmatter.title || 'Untitled Lesson',
    description: frontmatter.description || '',
    difficulty: frontmatter.difficulty || 'Intermediate',
    duration: frontmatter.duration || '30 minutes',
    topics: frontmatter.topics || [],
    content: sections
  };
  
  return jsonLesson;
} 