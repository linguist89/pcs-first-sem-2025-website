import { NextResponse } from 'next/server';
import { ensureLessonsDirectory, getAllLessonFiles, parseLessonFile } from '@/utils/lessons';

/**
 * GET lessons endpoint
 * Returns a list of all available lessons
 */
export async function GET() {
  try {
    // Ensure the lessons directory exists
    const lessonsDirectory = await ensureLessonsDirectory();
    
    // Get all lesson files
    const lessonFiles = await getAllLessonFiles();
    
    // Handle case where no lessons are found
    if (!Array.isArray(lessonFiles) || lessonFiles.length === 0) {
      console.log('No lesson files found');
      return NextResponse.json([]);
    }
    
    // Parse each lesson file
    const lessons = [];
    for (const lessonFile of lessonFiles) {
      try {
        const lesson = await parseLessonFile(lessonFile.file, lessonsDirectory);
        if (lesson) {
          // Add a unique ID for client rendering
          lesson.uniqueId = `${lesson.id}-${lesson.format}`;
          lessons.push(lesson);
        }
      } catch (parseError) {
        console.error(`Error parsing lesson file ${lessonFile.file}:`, parseError);
        // Continue with other lessons instead of failing the entire request
      }
    }
    
    // Sort lessons by ID
    lessons.sort((a, b) => {
      // Try to extract numbers from IDs for numerical sorting
      const aNum = parseInt(a.id, 10);
      const bNum = parseInt(b.id, 10);
      
      // If both are valid numbers, sort numerically
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum;
      }
      
      // Fall back to string comparison
      return a.id.localeCompare(b.id);
    });
    
    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error retrieving lessons:', error);
    return NextResponse.json({ error: 'Failed to retrieve lessons' }, { status: 500 });
  }
} 