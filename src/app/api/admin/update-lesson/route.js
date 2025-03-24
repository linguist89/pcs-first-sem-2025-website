import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { ensureLessonsDirectory } from '@/utils/lessons';
import { validateLesson } from '@/utils/lessonSchema';

/**
 * API route to update a lesson JSON file
 */
export async function POST(request) {
  try {
    const { lessonData, format } = await request.json();
    
    if (!lessonData || !lessonData.id) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid lesson data: missing required fields' 
      }, { status: 400 });
    }
    
    // Validate lesson structure
    const validation = validateLesson(lessonData);
    if (!validation.isValid) {
      return NextResponse.json({ 
        success: false,
        error: `Invalid lesson structure: ${validation.errors.join(', ')}` 
      }, { status: 400 });
    }
    
    // Ensure lessons directory exists
    const lessonsDirectory = await ensureLessonsDirectory();
    
    // Determine path based on format
    let filePath;
    if (format === 'modular') {
      const moduleDir = path.join(lessonsDirectory, 'modules', lessonData.slug || `${lessonData.id}-${lessonData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(moduleDir)) {
        fs.mkdirSync(moduleDir, { recursive: true });
      }
      
      filePath = path.join(moduleDir, 'index.json');
    } else {
      // Default to JSON format
      filePath = path.join(lessonsDirectory, 'json', `${lessonData.id}-${lessonData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.json`);
    }
    
    // Write the updated lesson data
    fs.writeFileSync(filePath, JSON.stringify(lessonData, null, 2), 'utf8');
    
    return NextResponse.json({
      success: true,
      message: 'Lesson updated successfully',
      path: filePath
    });
    
  } catch (error) {
    console.error('Error updating lesson:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update lesson: ' + error.message 
      },
      { status: 500 }
    );
  }
} 