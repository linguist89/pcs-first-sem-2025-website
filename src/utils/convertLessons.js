import fs from 'fs';
import path from 'path';
import { createModularLessonStructure } from './lessonContentLoader';

/**
 * Convert JSON lessons to modular format
 * 
 * @param {Array} lessonIds - Array of lesson IDs to convert
 * @returns {Promise<Array>} - Array of conversion results
 */
export async function convertLessonsToModular(lessonIds) {
  const results = [];
  
  for (const id of lessonIds) {
    try {
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
        console.error(`Lesson with ID ${id} not found at ${jsonLessonPath}`);
        results.push({
          id,
          success: false,
          error: `Lesson with ID ${id} not found`
        });
        continue;
      }
      
      // Read the lesson data
      const jsonContent = fs.readFileSync(jsonLessonPath, 'utf8');
      let lessonData;
      
      try {
        lessonData = JSON.parse(jsonContent);
      } catch (parseError) {
        console.error(`Error parsing JSON lesson data for ${id}:`, parseError);
        results.push({
          id,
          success: false,
          error: `Invalid JSON format in lesson ${id}: ${parseError.message}`
        });
        continue;
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
      
      results.push({
        id,
        success: true,
        path: result.lessonDir,
        sectionCount: result.sectionCount
      });
    } catch (error) {
      console.error(`Error converting lesson ${id} to modular format:`, error);
      results.push({
        id,
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
} 