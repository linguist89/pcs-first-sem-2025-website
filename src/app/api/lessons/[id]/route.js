import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ensureLessonsDirectory, parseLessonFile, getAllLessonFiles } from '@/utils/lessons';

export async function GET(request, context) {
  const { id } = context.params;
  
  // Check if ID is undefined or empty
  if (!id || id === 'undefined') {
    return NextResponse.json({ 
      error: 'Missing or invalid lesson ID parameter'
    }, { status: 400 });
  }
  
  try {
    // Ensure the lessons directory exists and has content
    const lessonsDirectory = ensureLessonsDirectory();
    
    // Get all lesson files (markdown and JSON)
    const lessonFiles = getAllLessonFiles();
    
    // If no lessons exist despite our attempt to create them, return error
    if (lessonFiles.length === 0) {
      return NextResponse.json({ error: 'No lessons available' }, { status: 404 });
    }
    
    // Try to find a matching file with different patterns
    let matchedLesson;
    
    // First try exact file name match
    matchedLesson = lessonFiles.find(({ file }) => {
      const fileName = path.parse(file).name;
      return fileName.startsWith(`${id}-`) || fileName === id;
    });
    
    // Then try searching by lesson number in metadata
    if (!matchedLesson) {
      // For markdown files, we need to check frontmatter
      // For JSON files, we check the id field
      for (const { file, format } of lessonFiles) {
        if (format === 'json') {
          // For JSON files, read the file and check id
          const fullPath = path.join(lessonsDirectory, file);
          if (fs.existsSync(fullPath)) {
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            try {
              const jsonData = JSON.parse(fileContents);
              if (jsonData.id?.toString() === id) {
                matchedLesson = { file, format };
                break;
              }
            } catch (err) {
              // Skip files with invalid JSON
              continue;
            }
          }
        } else {
          // For markdown files, check frontmatter
          const fullPath = path.join(lessonsDirectory, file);
          if (fs.existsSync(fullPath)) {
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            try {
              const { data } = matter(fileContents);
              if (data.id?.toString() === id || data.lesson?.toString() === id) {
                matchedLesson = { file, format };
                break;
              }
            } catch (err) {
              // Skip files with invalid frontmatter
              continue;
            }
          }
        }
      }
    }
    
    if (!matchedLesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }
    
    // Parse the lesson file to get metadata and content
    const lessonData = parseLessonFile(matchedLesson.file, lessonsDirectory, true);
    if (!lessonData) {
      return NextResponse.json({ error: 'Failed to parse lesson' }, { status: 500 });
    }
    
    // Get sorted lessons for navigation
    const sortedLessonFiles = lessonFiles
      .map(({ file }) => file)
      .sort((a, b) => {
        // Extract lesson number from file name
        const numA = parseInt(path.parse(a).name.split('-')[0]);
        const numB = parseInt(path.parse(b).name.split('-')[0]);
        return numA - numB;
      });
    
    const currentIndex = sortedLessonFiles.findIndex(file => file === matchedLesson.file);
    let prevLesson = null;
    let nextLesson = null;
    
    if (currentIndex > 0) {
      // Get the previous lesson's ID
      const prevFile = sortedLessonFiles[currentIndex - 1];
      const prevLessonData = parseLessonFile(prevFile, lessonsDirectory);
      prevLesson = prevLessonData?.id;
    }
    
    if (currentIndex < sortedLessonFiles.length - 1) {
      // Get the next lesson's ID
      const nextFile = sortedLessonFiles[currentIndex + 1];
      const nextLessonData = parseLessonFile(nextFile, lessonsDirectory);
      nextLesson = nextLessonData?.id;
    }
    
    // Add navigation links to lesson data
    const { lesson, content } = lessonData;
    lesson.prevLesson = prevLesson;
    lesson.nextLesson = nextLesson;
    
    // Return both lesson metadata and content
    return NextResponse.json({ lesson, content });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json({ error: 'Failed to load lesson' }, { status: 500 });
  }
} 