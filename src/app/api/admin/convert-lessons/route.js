import { NextResponse } from 'next/server';
import { convertLessonsToModular } from '@/utils/convertLessons';

/**
 * API route to convert specified lessons to modular format
 */
export async function GET() {
  try {
    console.log('Starting conversion of lessons to modular format...');
    
    // Lessons to convert
    const lessonsToConvert = ['01-introduction-to-functions', '02-memory-recall-experiments'];
    
    // Convert lessons
    const results = await convertLessonsToModular(lessonsToConvert);
    
    // Log results
    console.log('\nConversion Results:');
    results.forEach(result => {
      if (result.success) {
        console.log(`✅ Lesson ${result.id} converted successfully`);
        console.log(`   - Path: ${result.path}`);
        console.log(`   - Sections: ${result.sectionCount}`);
      } else {
        console.log(`❌ Lesson ${result.id} conversion failed`);
        console.log(`   - Error: ${result.error}`);
      }
    });
    
    return NextResponse.json({
      success: true,
      results
    });
    
  } catch (error) {
    console.error('Error in conversion process:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to convert lessons: ' + error.message 
      },
      { status: 500 }
    );
  }
} 