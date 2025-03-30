import { NextResponse } from 'next/server';
import { getLessonSection } from '@/lib/lessons';

export async function GET(request, context) {
  try {
    // Get the lesson ID and section ID from params
    const params = await context.params;
    const lessonId = params.id;
    const sectionId = params.sectionId;
    
    // Get the section content using the utility function
    const section = await getLessonSection(lessonId, sectionId);
    
    if (!section) {
      return NextResponse.json(
        { error: `Section ${sectionId} not found for lesson ${lessonId}` },
        { status: 404 }
      );
    }
    
    // Return just the raw content (not the frontmatter)
    return new NextResponse(section.content, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('Error loading section file:', error);
    return NextResponse.json(
      { error: 'Failed to load section content' },
      { status: 500 }
    );
  }
} 