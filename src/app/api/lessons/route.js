import { NextResponse } from 'next/server';
import { getAllLessonsMetadata } from '@/lib/lessons';

/**
 * GET lessons endpoint
 * Returns a list of all available lessons
 */
export async function GET() {
  try {
    // Get all lessons metadata
    const lessons = await getAllLessonsMetadata();
    
    if (!lessons || lessons.length === 0) {
      return NextResponse.json({ 
        message: 'No lessons found' 
      }, { status: 404 });
    }
    
    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error getting all lessons:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve lessons' }, 
      { status: 500 }
    );
  }
} 