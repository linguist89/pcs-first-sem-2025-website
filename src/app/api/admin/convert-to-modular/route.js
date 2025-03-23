import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { createModularLessonStructure } from '@/utils/lessonContentLoader';

/**
 * API route to convert a JSON lesson to a modular lesson structure
 */
export async function POST(request) {
  try {
    // Get the lesson ID from the query params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 });
    }
    
    // Path to the JSON lesson file
    const jsonLessonPath = path.join(
      process.cwd(),
      'public',
      'data',
      'Lessons',
      'json',
      `${id}.json`
    );
    
    // Check if the lesson exists
    if (!fs.existsSync(jsonLessonPath)) {
      return NextResponse.json(
        { error: `Lesson with ID ${id} not found` },
        { status: 404 }
      );
    }
    
    // Read the lesson data
    const jsonContent = fs.readFileSync(jsonLessonPath, 'utf8');
    let lessonData;
    
    try {
      lessonData = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error('Error parsing JSON lesson data:', parseError);
      return NextResponse.json({ 
        error: `Invalid JSON format in lesson ${id}: ${parseError.message}`
      }, { status: 400 });
    }
    
    // Path to where the modular lesson will be stored
    const modulesDir = path.join(
      process.cwd(),
      'public',
      'data',
      'Lessons',
      'modules'
    );
    
    // Ensure the modules directory exists
    if (!fs.existsSync(modulesDir)) {
      fs.mkdirSync(modulesDir, { recursive: true });
    }
    
    console.log(`Converting lesson ${id} to modular format...`);
    
    // Create the modular lesson structure
    const result = await createModularLessonStructure(modulesDir, lessonData);
    
    console.log(`Conversion complete for lesson ${id}`);
    
    return NextResponse.json({
      success: true,
      lessonId: id,
      path: result.lessonDir,
      sectionCount: result.sectionCount
    });
    
  } catch (error) {
    console.error('Error converting lesson to modular format:', error);
    
    return NextResponse.json(
      { error: 'Failed to convert lesson: ' + error.message },
      { status: 500 }
    );
  }
} 