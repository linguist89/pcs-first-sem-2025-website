import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const lessonsDirectory = path.join(process.cwd(), 'src', 'lessons');

/**
 * Gets all available lesson IDs
 * @returns {Promise<string[]>} Array of lesson IDs
 */
export async function getAllLessonIds() {
  try {
    const entries = await fs.promises.readdir(lessonsDirectory, { withFileTypes: true });
    const lessonDirs = entries
      .filter(entry => entry.isDirectory() && entry.name.startsWith('lesson'))
      .map(entry => entry.name.replace('lesson', ''));
    
    return lessonDirs;
  } catch (error) {
    console.error('Error getting lesson IDs:', error);
    return [];
  }
}

/**
 * Gets metadata for a specific lesson
 * @param {string} id Lesson ID
 * @returns {Promise<Object|null>} Lesson metadata or null if not found
 */
export async function getLessonMetadata(id) {
  try {
    // Normalize the ID (remove leading zeros)
    const normalizedId = id.replace(/^0+/, '');
    const metadataPath = path.join(lessonsDirectory, `lesson${normalizedId}`, 'metadata.json');
    
    // Check if metadata file exists
    try {
      await fs.promises.access(metadataPath, fs.constants.R_OK);
    } catch (error) {
      console.error(`Metadata file not found: ${metadataPath}`);
      return null;
    }
    
    // Read and parse the metadata file
    const metadataContent = await fs.promises.readFile(metadataPath, 'utf8');
    return JSON.parse(metadataContent);
  } catch (error) {
    console.error(`Error loading metadata for lesson ${id}:`, error);
    return null;
  }
}

/**
 * Gets all lesson metadata
 * @returns {Promise<Object[]>} Array of lesson metadata objects
 */
export async function getAllLessonsMetadata() {
  try {
    const lessonIds = await getAllLessonIds();
    const lessonsData = await Promise.all(
      lessonIds.map(async (id) => {
        return await getLessonMetadata(id);
      })
    );
    
    // Filter out null values and sort by lesson ID
    return lessonsData
      .filter(Boolean)
      .sort((a, b) => {
        const idA = parseInt(a.id);
        const idB = parseInt(b.id);
        return idA - idB;
      });
  } catch (error) {
    console.error('Error getting all lessons metadata:', error);
    return [];
  }
}

/**
 * Gets a section from a lesson
 * @param {string} lessonId Lesson ID
 * @param {string} sectionId Section ID
 * @returns {Promise<Object|null>} Section content and frontmatter or null if not found
 */
export async function getLessonSection(lessonId, sectionId) {
  try {
    // Normalize the ID (remove leading zeros)
    const normalizedId = lessonId.replace(/^0+/, '');
    const sectionPath = path.join(lessonsDirectory, `lesson${normalizedId}`, 'sections', `${sectionId}.md`);
    
    // Check if section file exists
    try {
      await fs.promises.access(sectionPath, fs.constants.R_OK);
    } catch (error) {
      console.error(`Section file not found: ${sectionPath}`);
      return null;
    }
    
    // Read the section markdown file
    const sectionContent = await fs.promises.readFile(sectionPath, 'utf8');
    const { data: frontMatter, content } = matter(sectionContent);
    
    return {
      id: sectionId,
      content,
      ...frontMatter
    };
  } catch (error) {
    console.error(`Error loading section ${sectionId} for lesson ${lessonId}:`, error);
    return null;
  }
}

/**
 * Gets all sections for a lesson
 * @param {string} lessonId Lesson ID
 * @returns {Promise<Object[]>} Array of section objects
 */
export async function getLessonSections(lessonId) {
  try {
    const metadata = await getLessonMetadata(lessonId);
    
    if (!metadata || !metadata.sections || !metadata.sections.length) {
      return [];
    }
    
    const sections = await Promise.all(
      metadata.sections.map(async (sectionId) => {
        return await getLessonSection(lessonId, sectionId);
      })
    );
    
    return sections.filter(Boolean);
  } catch (error) {
    console.error(`Error loading sections for lesson ${lessonId}:`, error);
    return [];
  }
}

/**
 * Gets complete lesson data including metadata and sections
 * @param {string} id Lesson ID
 * @returns {Promise<Object|null>} Complete lesson data or null if not found
 */
export async function getCompleteLesson(id) {
  try {
    const metadata = await getLessonMetadata(id);
    
    if (!metadata) {
      return null;
    }
    
    const sections = await getLessonSections(id);
    
    return {
      ...metadata,
      sections
    };
  } catch (error) {
    console.error(`Error loading complete lesson ${id}:`, error);
    return null;
  }
} 