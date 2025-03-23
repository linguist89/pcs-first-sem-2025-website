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
    const lessonsDirectory = await ensureLessonsDirectory();
    
    // Get all lesson files (markdown and JSON)
    const lessonFiles = await getAllLessonFiles();
    
    // If no lessons exist despite our attempt to create them, return error
    if (!Array.isArray(lessonFiles) || lessonFiles.length === 0) {
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
        if (format === 'json' || format === 'modular') {
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
              console.error(`Error parsing JSON file ${file}:`, err);
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
              console.error(`Error parsing markdown file ${file}:`, err);
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
    const lessonData = await parseLessonFile(matchedLesson.file, lessonsDirectory, true);
    if (!lessonData) {
      return NextResponse.json({ error: 'Failed to parse lesson' }, { status: 500 });
    }
    
    // Get sorted lessons for navigation
    let sortedLessons = [];
    try {
      // Parse all lessons to get their IDs and sort them
      for (const { file } of lessonFiles) {
        const lessonInfo = await parseLessonFile(file, lessonsDirectory, false);
        if (lessonInfo && lessonInfo.id) {
          sortedLessons.push({
            file,
            id: lessonInfo.id
          });
        }
      }
      
      // Sort by ID numerically when possible
      sortedLessons.sort((a, b) => {
        const numA = parseInt(a.id, 10);
        const numB = parseInt(b.id, 10);
        
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        return a.id.localeCompare(b.id);
      });
    } catch (error) {
      console.error('Error sorting lessons:', error);
      // Continue without navigation if sorting fails
      sortedLessons = [];
    }
    
    // Find previous and next lessons
    let prevLesson = null;
    let nextLesson = null;
    
    if (sortedLessons.length > 0) {
      const currentIndex = sortedLessons.findIndex(lesson => lesson.id === lessonData.lesson.id);
      
      if (currentIndex > 0) {
        prevLesson = sortedLessons[currentIndex - 1].id;
      }
      
      if (currentIndex < sortedLessons.length - 1 && currentIndex !== -1) {
        nextLesson = sortedLessons[currentIndex + 1].id;
      }
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