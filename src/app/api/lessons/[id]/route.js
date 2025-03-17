import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Sample lesson content to create if no lessons exist
const sampleLessonContent = `---
title: Introduction to Functions
description: Learn the basics of functions in Python and how to use them effectively
difficulty: Beginner
duration: 30 minutes
---

# Scenario
Sarah, the team lead, approached Mark with a file in hand. "Mark, we've got this eye-tracking data," she said, placing the file on his desk. "It's a bit of a mess, but we need to figure out [1 how long users are looking at different parts of our interface]. [2 We're hoping to find patterns] – like, what's catching their attention? Can you clean this up and give us some basic stats? [3 We need to know the number of valid data points, the average gaze duration, and the variability of longer gazes]." She added, "Let's start simple and build up from there."

## Objective
Sarah wants Mark to analyze eye-tracking data to understand user attention. To do this, Mark needs to:

1.  **Clean the data:** Remove invalid entries like "NA", "error", and "NaN".
2.  **Calculate basic statistics:** Find the number of valid data points, the average gaze duration, and the standard deviation of longer gaze durations.
3.  **Identify patterns:** Determine what parts of the interface are holding user attention.
`;

// Ensure the lessons directory exists and has at least one lesson
function ensureLessonsDirectory() {
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

export async function GET(request, context) {
  const { id } = await context.params;
  
  // Check if ID is undefined or empty
  if (!id || id === 'undefined') {
    return NextResponse.json({ 
      error: 'Missing or invalid lesson ID parameter'
    }, { status: 400 });
  }
  
  try {
    // Ensure the lessons directory exists and has content
    const lessonsDirectory = ensureLessonsDirectory();
    
    const lessonFiles = fs.readdirSync(lessonsDirectory)
      .filter(file => file.endsWith('.md'));
    
    // If no lessons exist despite our attempt to create them, return error
    if (lessonFiles.length === 0) {
      return NextResponse.json({ error: 'No lessons available' }, { status: 404 });
    }
    
    // Try to find a matching file with different patterns
    let lessonFile;
    
    // First try exact filename match (e.g., 01-introduction-to-functions.md)
    lessonFile = lessonFiles.find(file => {
      const fileName = path.parse(file).name;
      return fileName.startsWith(`${id}-`) || fileName === id;
    });
    
    // Then try searching by lesson number in frontmatter
    if (!lessonFile) {
      lessonFile = lessonFiles.find(file => {
        // Parse the front matter to check the ID
        const fullPath = path.join(lessonsDirectory, file);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        
        try {
          const { data } = matter(fileContents);
          return data.id?.toString() === id || data.lesson?.toString() === id;
        } catch (err) {
          // Skip files with invalid frontmatter
          return false;
        }
      });
    }
    
    if (!lessonFile) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }
    
    // Read the markdown file
    const fullPath = path.join(lessonsDirectory, lessonFile);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    
    // Parse front matter
    const { data: frontmatter, content } = matter(fileContents);
    
    // Get the lesson number from the filename (e.g., "01" from "01-introduction-to-functions.md")
    const lessonNumber = path.parse(lessonFile).name.split('-')[0];
    
    // Check for next and previous lessons
    const sortedLessonFiles = lessonFiles
      .filter(file => file.endsWith('.md'))
      .sort((a, b) => {
        const numA = parseInt(path.parse(a).name.split('-')[0]);
        const numB = parseInt(path.parse(b).name.split('-')[0]);
        return numA - numB;
      });
    
    const currentIndex = sortedLessonFiles.findIndex(file => file === lessonFile);
    let prevLesson = null;
    let nextLesson = null;
    
    if (currentIndex > 0) {
      const prevFile = sortedLessonFiles[currentIndex - 1];
      prevLesson = path.parse(prevFile).name.split('-')[0];
    }
    
    if (currentIndex < sortedLessonFiles.length - 1) {
      const nextFile = sortedLessonFiles[currentIndex + 1];
      nextLesson = path.parse(nextFile).name.split('-')[0];
    }
    
    // Construct lesson metadata
    const lesson = {
      id: lessonNumber,
      title: frontmatter.title || 'Untitled Lesson',
      description: frontmatter.description || '',
      difficulty: frontmatter.difficulty || 'Intermediate',
      duration: frontmatter.duration || '30 minutes',
      prevLesson,
      nextLesson,
      ...frontmatter
    };
    
    // Return both lesson metadata and content
    return NextResponse.json({ lesson, content });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json({ error: 'Failed to load lesson' }, { status: 500 });
  }
} 