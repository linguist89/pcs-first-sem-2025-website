import { convertLessonsToModular } from '../utils/convertLessons';

async function main() {
  console.log('Starting conversion of lessons to modular format...');
  
  // Lessons to convert
  const lessonsToConvert = ['01-introduction-to-functions', '02-memory-recall-experiments'];
  
  try {
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
  } catch (error) {
    console.error('Error in conversion process:', error);
  }
}

// Execute the main function
main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
}); 