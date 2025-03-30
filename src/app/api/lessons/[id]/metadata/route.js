import { NextResponse } from 'next/server';
import { getLessonMetadata } from '@/lib/lessons';

export async function GET(request, context) {
  try {
    // Get the lesson ID from params
    const params = await context.params;
    const lessonId = params.id;
    
    // Get lesson metadata using the utility function
    const metadata = await getLessonMetadata(lessonId);
    
    if (!metadata) {
      return NextResponse.json(
        { error: `Lesson ${lessonId} not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Error loading lesson metadata:', error);
    return NextResponse.json(
      { error: 'Failed to load lesson metadata' },
      { status: 500 }
    );
  }
} 