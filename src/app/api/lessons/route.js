import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { ensureLessonsDirectory, parseLessonFile, getAllLessonFiles } from '@/utils/lessons';

export async function GET() {
  try {
    // Ensure the lessons directory exists and has content
    const lessonsDirectory = ensureLessonsDirectory();
    
    // Get all lesson files (only JSON)
    const lessonFiles = getAllLessonFiles();
    
    // If there are still no lesson files (something went wrong), return empty array
    if (lessonFiles.length === 0) {
      return NextResponse.json([]);
    }
    
    // Parse each file and extract metadata
    const lessons = lessonFiles
      .map(({ file }) => parseLessonFile(file, lessonsDirectory))
      .filter(Boolean); // Remove any null entries from parsing errors
    
    // Sort by lesson number
    lessons.sort((a, b) => {
      const numA = parseInt(a.id);
      const numB = parseInt(b.id);
      return numA - numB;
    });
    
    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json({ error: 'Failed to load lessons' }, { status: 500 });
  }
} 